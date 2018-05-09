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
    let getCode = () => {return new Promise((resolve) => {
        document.location.replace('https://github.com/login/oauth/authorize' + '?client_id=a256b8d17f75ee274bf3');
        resolve(1);
      })
    }

    getCode()
      .then(response=> {
        let code = qs.parse(document.location.search.slice(1)).code;
        console.log('code::::::', code);
        // TODO : Faire la suite que quand le code est bien récupéré, trouver une commande pour dire "une fois que la redirection est faite, code=qs...slice.."

        let dataAccess = {
          code: code,
          client_id: 'a256b8d17f75ee274bf3',
          client_secret: '88f8e3471f02c4a9dd3d5e23fd6fd98cdd1f9fa5'
        }

        axios.post('https://github.com/login/oauth/access_token', dataAccess, {
          headers: {'Content-Type': 'application/json'}
        }).then(response => console.log(response));
      })
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