import React from 'react'
import { Button, TextField, withStyles } from 'material-ui'
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

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

class AddPropertiesForm extends React.Component {
  constructor (props){
    super(props);

    let firstNewPropertyForm = [<TextField
      id="key"
      label="Property Name"
      type="search"
      className={this.props.textField}
      margin="normal"
      key={"propForm 0"}
    />, <TextField
      id="value"
      label="Property Value"
      type="search"
      className={this.props.textField}
      margin="normal"
      key={"propForm 1"}
    />];

    this.state = {
      propertiesFields: firstNewPropertyForm,
    }
  }

  /* Function called when user clicks the 'add a new property' plus symbol */
  addNewProperty = () => {
    let propFields = this.state.propertiesFields;

    let newNamePropField = <TextField
      id="key"
      label="Property Name"
      type="search"
      className={this.props.textField}
      margin="normal"
      key={"propForm " + propFields.length}
    />
    let newValuePropField = <TextField
      id="value"
      label="Property Value"
      type="search"
      className={this.props.textField}
      margin="normal"
      key={["propForm", propFields.length + 1].join(' ')}
    />
    let newArrayProperties = propFields.concat([newNamePropField, newValuePropField]);

    this.setState({propertiesFields: newArrayProperties});
  }

  render () {
    const {classes} = this.props;

    return (
      <div>
        <React.Fragment>
          {this.state.propertiesFields}
        </React.Fragment>
        <Button variant="fab"
                color="primary"
                aria-label="add"
                className={classes.button}
                onClick={this.addNewProperty}>
          <AddIcon />
        </Button>
      </div>
    )
  }
}

AddPropertiesForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPropertiesForm);