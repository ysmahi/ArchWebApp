import React from 'react'
import ModelNavigatorManager from './ModelNavigatorManager'
import ElementForm from './ElementForm'
import { Button, withStyles } from 'material-ui'
import './ReadModifyInterface.css'
import PropTypes from 'prop-types'
import { getBlobSha, updateElementInfo } from '../Utils/GithubApiCall'
import { json2xml } from 'xml-js'
import * as cookie from 'react-cookies'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class ReadModifyInterface extends React.Component {
  constructor (props) {
    super(props);

    this.dataElementHandler = this.dataElementHandler.bind(this);
    this.pushChanges = this.pushChanges.bind(this);
    this.folderClickHandler = this.folderClickHandler.bind(this);

    this.state = {
      nameElement: 'Name',
      idElement: 'ID',
      typeElement: 'Type of Element',
      documentationElement: 'Write documentation here',
      properties: [],
      displayedElementScreen:'' // can be 'create element', 'existing element form', 'new element'
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
      displayedElementScreen: 'existing element form'
    });
  }

  /* Called when a folder was clicked in treeview and we want create a new element button to appear */
  folderClickHandler = () => {
    if(this.state.displayedElementScreen !== 'create element') {
      this.setState({displayedElementScreen: 'create element',});
    }
  }

  /* Commits the changes in the element information to the github repo */
  pushChanges = (nameElement, idElement, documentationElement, propertiesElement) => {
    let token = cookie.load('token');
    console.log('state', this.state);

    /*
    getBlobSha('ysmahi', 'ArchiTest', this.state.pathElement)
      .then(blobSha => {
        let jsonElement = {"elements":
            [{"type":"element",
              "name":"archimate:ApplicationComponent",
              "attributes":{"\n    xmlns:archimate":"http://www.archimatetool.com/archimate",
                "\n    name":nameElement,
                "\n    id":idElement,
                "\n    documentation":documentationElement},
              "elements":propertiesElement.map(el => {
                return {
                  "type": "element",
                    "name": "properties",
                    "attributes": {"\n      key": el.key, "\n      value": el.value}
                }
              })
            }]
        }
        let xmlModif = json2xml(jsonElement).replaceAll('>', '>0&a');
        xmlModif = xmlModif.split('0&a');
        let newXml = xmlModif.map((el, index)=>{
          if(index !== 0){
            if(el[1] !== '/'){
              return el.replace(/</, '\n  <');
            }

            else {
              return el.replace(/</, '\n<');
            }
          }

          else {return el;}
        }).join('');

        let finalXml = newXml.replaceAll('\n', '\n1&a').split('1&a').map((el)=>el.replace(' \n','\n'));

        updateElementInfo('ysmahi', 'ArchiTest', this.state.pathElement, finalXml.join('').concat('\n'),
          blobSha, token, "Axios commit message", "Yazid Smahi", "yazidsmahi@gmail.com");
    })
    */
  }

  /* Set state so that component renders an empty new element form */
  displayNewElementForm = () => {
    this.setState({displayedElementScreen: 'new element form'});
  }

  /* Retrieves properties in child and pass them to the pushChanges parent method so that a push to github is done */
  pushChanges = () => {
    let arrayProperties = this.refElementForm.getArrayProperties();

    this.props.pushChanges(this.state.nameElement,
      this.state.idElement,
      this.state.documentationElement,
      arrayProperties,
    );

    this.setState({
      propertiesElement: arrayProperties,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="TreeFormContainer">
        <div className='ModelNavigatorManager'>
          <ModelNavigatorManager
          dataElementHandler={this.dataElementHandler}
          folderClickNotifier={this.folderClickHandler}/>
        </div>
        {this.state.displayedElementScreen === 'create element' && (
          <div className = 'ElementForm'>
            <Button className={classes.button}
                    variant="raised"
                    color="primary"
                    onClick={()=>this.displayNewElementForm()}>
              Create Element
              <AddIcon className={classes.leftIcon} />
            </Button>
          </div>
        )}
        {this.state.displayedElementScreen === 'existing element form' && (
          <div className='ElementForm'>
            <ElementForm nameElement={this.state.nameElement}
                         typeElement={this.state.typeElement}
                         idElement={this.state.idElement}
                         documentationElement={this.state.documentationElement}
                         propertiesElement={this.state.propertiesElement}
                         pushChanges={this.pushChanges}
                         newElement={false}
            />
          </div>)}
        {this.state.displayedElementScreen === 'new element form' && (
          <div className='ElementForm'>
            <ElementForm nameElement=''
                         typeElement=''
                         idElement=''
                         documentationElement=''
                         propertiesElement={[]}
                         pushChanges={this.pushChanges}
                         newElement={true}
                         onRef={ref => (this.refElementForm = ref)}
            />
          </div>)}
      </div>
    );
  }
}

ReadModifyInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReadModifyInterface);

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};