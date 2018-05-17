import React from 'react'
import { Button, TextField } from 'material-ui'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AddPropertiesForm from './AddPropertiesForm'
import PropertiesForm from './PropertiesForm'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class ElementForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleNewProperty = this.handleNewProperty.bind(this);
    this.handleDeleteProperty = this.handleDeleteProperty.bind(this);

    this.state = {
      nameElement: this.props.nameElement,
      typeElement: this.props.typeElement,
      idElement: this.props.idElement,
      documentationElement: this.props.documentationElement,
      propertiesElement: this.props.propertiesElement,
      displayPropertiesAdding: false,
      newElement: this.props.newElement,
    }
  }

  /* Updates state in real time when user types in a text field */
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /* Imposes re-render so that the new property is taken into account
   * Called by child component AddPropertiesForm */
  handleNewProperty = (newProperty) => {
    let arrayProperties = this.refPropForm.getArrayProperties();
    this.setState({
      propertiesElement: arrayProperties.concat(newProperty),
      displayPropertiesAdding: false,
    });
  }

  /* Deletes property by modifying property array in state */
  handleDeleteProperty = (arrayProperties) => {
    this.setState({propertiesElement: arrayProperties});
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount () {
    this.props.onRef(undefined);
  }

  componentDidUpdate() {
    if (this.state.idElement !== this.props.idElement){
      this.setState({
        nameElement: this.props.nameElement,
        typeElement: this.props.typeElement,
        idElement: this.props.idElement,
        documentationElement: this.props.documentationElement,
        propertiesElement: this.props.propertiesElement,
      })
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <TextField
          id="full-width"
          label="Name"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.nameElement}
          onChange={this.handleChange('nameElement')}
          fullWidth
          margin="normal"
        />
        <TextField
          id="full-width"
          label='Type'
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!this.state.newElement}
          value={this.state.typeElement}
          onChange={this.handleChange('typeElement')}
          fullWidth
          margin="normal"
        />
        <TextField
          id="full-width"
          label='ID'
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!this.state.newElement}
          value={this.state.idElement}
          onChange={this.handleChange('idElement')}
          fullWidth
          margin="normal"
        />
        <TextField
          id="textarea"
          label="Documentation"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.documentationElement}
          onChange={this.handleChange('documentationElement')}
          multiline
          rows={4}
          className={classes.textField}
          margin="normal"
        />
        <div>
          <PropertiesForm arrayProperties={this.state.propertiesElement}
                          idElement={this.state.idElement}
                          deleteProperty={this.handleDeleteProperty}
                          onRef={ref => (this.refPropForm = ref)}/>
        </div>
        {this.state.displayPropertiesAdding && (
          <div className="AddPropertiesForm">
          <AddPropertiesForm handleNewProperty={this.handleNewProperty}/>
        </div>)}
        {!this.state.displayPropertiesAdding && (
          <div>
          <Button size="medium" className={classes.button}
                  onClick={()=>this.setState({displayPropertiesAdding: true})}>
            Add properties
          </Button>
            {this.state.newElement && (
              <Button size="medium" className={classes.button}
                      onClick={()=>this.submitElement()}>
                Submit element
              </Button>
            )}
          <Button size="medium" className={classes.button}
                  onClick={this.props.pushChanges}>
            Push changes
          </Button>
        </div>)}
      </div>
    );
  }
}

ElementForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ElementForm);