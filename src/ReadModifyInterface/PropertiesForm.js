/* Component of element properties text fields
 * Params: array of json defined properties {key: name_of_property,
  * value: value_of_property } */
import React from 'react'
import { TextField } from 'material-ui'
import DeleteIcon from '@material-ui/icons/Delete'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import _ from 'lodash'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class PropertiesForm extends React.Component {
  constructor (props) {
    super(props);

    let arrayProperties = this.props.arrayProperties;

    this.state = {
      idElement: this.props.idElement,
      arrayProperties: arrayProperties,
    }

    for (let i=0; i<arrayProperties.length; i++) {
      this.state[arrayProperties[i].key] = arrayProperties[i].value;
    }
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount () {
    this.props.onRef(undefined);
  }

  componentDidUpdate() {
    if (this.props.idElement !== this.state.idElement || this.state.arrayProperties.length !== this.props.arrayProperties.length) {
      let newArrayProperties = this.props.arrayProperties;

      let newState = {
        idElement: this.props.idElement,
        arrayProperties: newArrayProperties,
      }

      for (let i=0; i<newArrayProperties.length; i++) {
        newState[newArrayProperties[i].key] = newArrayProperties[i].value;
      }

      this.setState(newState);
    }
  }

  /* Updates state of array of properties and returns the new array */
  getArrayProperties = () => {
    let arrayProperties = this.state.arrayProperties.map(property=>{
      return {key: property.key,
        value: this.state[property.key]}
    });

    this.setState({arrayProperties: arrayProperties});
    return arrayProperties;
  }

  /* Updates state in real time when user is typing in a text field */
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /* Deletes the property from state and notifies parent components */
  deleteProperty = (property, index) => {
    let newState = _.clone(this.state);
    delete newState[property.key];
    newState.arrayProperties.splice(index, 1);
    console.log('state after delete', newState);
    this.props.deleteProperty(newState.arrayProperties);
    this.setState(newState);
  }

  render () {
    const {classes} = this.props;

    let finalCompo = this.state.arrayProperties.map((property, index) => {
      return (
        <div className="property" key={property.key}>
          <TextField
            id="full-width"
            label={property.key}
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state[property.key]}
            fullWidth
            margin="normal"
            onChange={this.handleChange(property.key)}
          />
          <Button variant="fab"
                  aria-label="delete"
                  className={classes.button}
                  onClick={()=>this.deleteProperty(property, index)}>
            <DeleteIcon />
          </Button>
        </div>
    )});

    return (<React.Fragment>
      {finalCompo}
    </React.Fragment>);
  }
}

PropertiesForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PropertiesForm);