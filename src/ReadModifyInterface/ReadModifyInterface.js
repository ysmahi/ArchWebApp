import React from 'react'
import ModelNavigatorManager from './ModelNavigatorManager'
import ElementForm from './ElementForm'
import { Button, withStyles } from 'material-ui'
import './ReadModifyInterface.css'
import PropTypes from 'prop-types';
import axios from 'axios/index'
import * as qs from 'qs'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class ReadModifyInterface extends React.Component {
  constructor (props) {
    super(props);

    this.jsonElementHandler = this.jsonElementHandler.bind(this);

    this.state = {
      displayedElementForm: '',
      nameElement: 'Name',
      typeElement: 'Type of Element',
      documentationElement: 'Documentation',
      properties: {property1: 'value1'},
    }
  }

  jsonElementHandler = (jsonElement) => {
    let properties = {};
    let elementHasProperties = false;
    if (jsonElement.elements[0].hasOwnProperty('elements')) {
      properties = jsonElement.elements[0].elements.map(el => el.attributes);
      elementHasProperties = true;
    }

    this.setState({nameElement: jsonElement.elements[0].attributes.name,
    typeElement: jsonElement.elements[0].name,
    idElement: jsonElement.elements[0].attributes.id,
    documentationElement: jsonElement.elements[0].attributes.documentation,
    propertiesElement: properties,
    elementHasProperties: elementHasProperties});
  }

  pushChanges = () => {

    // TODO : Faire la suite que quand le code est bien récupéré, trouver une commande pour dire "une fois que la redirection est faite, code=qs...slice.."

  }


  render() {
    const {classes} = this.props;

    return (
      <div className="TreeFormContainer">
        <div className='ModelNavigatorManager'>
          <ModelNavigatorManager
          jsonElementHandler={this.jsonElementHandler}/>
        </div>
        <div className='ElementForm'>
          <ElementForm nameElement={this.state.nameElement}
                       typeElement={this.state.typeElement}
                       idElement={this.state.idElement}
                       documentationElement={this.state.documentationElement}
                       propertiesElement={this.state.propertiesElement}
                       hasProperties={this.state.elementHasProperties}/>
          <Button size="medium" className={classes.button}
          onClick={this.pushChanges}>
            Push changes
          </Button>
        </div>
      </div>
    );
  }
}

ReadModifyInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReadModifyInterface);