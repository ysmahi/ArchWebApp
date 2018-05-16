import React from 'react'
import { Button, TextField, withStyles } from 'material-ui'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'

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

    this.state = {
      name: '',
      value: '',
    }
  }

  /* Called each time a property field is modified to change the value of the field */
  handleChangeInPropertiesForm = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /* Called when user clicks the 'add a new property' plus symbol */
  addNewProperty = () => {
    this.props.handleNewProperty({
      'key': this.state.name,
      'value': this.state.value,
    })

    this.setState({
      name:'',
      value:''
    })
  }

  render () {
    const {classes} = this.props;

    return (
      <div>
        <TextField
          id="key"
          label="Property Name"
          value={this.state.name}
          type="search"
          className={this.props.textField}
          margin="normal"
          key={"propName"}
          onChange={this.handleChangeInPropertiesForm('name')}
        />
        <TextField
          id="value"
          label="Property Value"
          value={this.state.value}
          type="search"
          className={this.props.textField}
          margin="normal"
          key={"propValue"}
          onChange={this.handleChangeInPropertiesForm('value')}
        />
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