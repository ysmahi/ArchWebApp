import React from 'react'
import ModelNavigatorManager from './ModelNavigatorManager'
import ElementForm from './ElementForm'
import { Button, withStyles } from 'material-ui'
import './ReadModifyInterface.css'
import PropTypes from 'prop-types';
import { getBlobSha, updateElementInfo } from '../Utils/GithubApiCall'
import { json2xml } from 'xml-js'
import * as cookie from 'react-cookies'

const styles = theme => ({
});

class ReadModifyInterface extends React.Component {
  constructor (props) {
    super(props);

    this.dataElementHandler = this.dataElementHandler.bind(this);
    this.pushChanges = this.pushChanges.bind(this);

    this.state = {
      displayedElementForm: '',
      nameElement: 'Name',
      idElement: 'ID',
      typeElement: 'Type of Element',
      documentationElement: 'Write documentation here',
      properties: [],
    }
  }

  /* Function that receives model element's informations when a click is done on treeview and that passes it to
  * the read and modify interface
  * Args: jsonElement is the json containing informations of element
  * pathElement is the path of the element in the github repo */
  dataElementHandler = (jsonElement, pathElement) => {

    let properties = [];
    if (jsonElement.elements[0].hasOwnProperty('elements')) {
      properties = jsonElement.elements[0].elements.map(el => el.attributes);
    }

    let documentation = jsonElement.elements[0].attributes.documentation;
    if (documentation === undefined) {
      documentation = 'Write documentation here';
    }

    this.setState({
      nameElement: jsonElement.elements[0].attributes.name,
      typeElement: jsonElement.elements[0].name,
      idElement: jsonElement.elements[0].attributes.id,
      documentationElement: documentation,
      propertiesElement: properties,
      pathElement: pathElement,
    });
  }

  pushChanges = (nameElement, idElement, documentationElement, propertiesElement) => {
    let token = cookie.load('token');
    console.log("dataatata", this.state.propertiesElement + "    " + this.state.nameElement);

    getBlobSha('ysmahi', 'ArchiTest', this.state.pathElement)
      .then(blobSha => {
        let jsonElement = {"elements":
            [{"type":"element",
              "name":"archimate:ApplicationComponent",
              "attributes":{"xmlns:archimate":"http://www.archimatetool.com/archimate",
                "name":nameElement,
                "id":idElement,
                "documentation":documentationElement},
              "elements":propertiesElement.map(el => {
                return {
                  "type": "element",
                    "name": "properties",
                    "attributes": {"key": el.key, "value": el.value}
                }
              })
            }]
        }
        console.log('xml', json2xml(jsonElement));
        updateElementInfo('ysmahi', 'ArchiTest', this.state.pathElement, json2xml(jsonElement),
          blobSha, token, "Axios commit message", "Yazid Smahi", "yazidsmahi@gmail.com");
    })
  }


  render() {

    return (
      <div className="TreeFormContainer">
        <div className='ModelNavigatorManager'>
          <ModelNavigatorManager
          dataElementHandler={this.dataElementHandler}/>
        </div>
        <div className='ElementForm'>
          <ElementForm nameElement={this.state.nameElement}
                       typeElement={this.state.typeElement}
                       idElement={this.state.idElement}
                       documentationElement={this.state.documentationElement}
                       propertiesElement={this.state.propertiesElement}
                       hasProperties={this.state.elementHasProperties}
                       pushChanges={this.pushChanges}
          />
        </div>
      </div>
    );
  }
}

ReadModifyInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReadModifyInterface);