import React from 'react'
import ModelNavigatorManager from './ModelNavigatorManager'
import ElementForm from './ElementForm'
import { withStyles } from 'material-ui'
import './ReadModifyInterface.css'

const styles = {
}

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

  render() {
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ReadModifyInterface);