/* Component of element properties text fields
 * Params: array of json defined properties {key: name_of_property,
  * value: value_of_property } */
import React from 'react'
import { TextField } from 'material-ui'

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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render () {
    let finalCompo = this.state.arrayProperties.map((property, index) => (
      <TextField
        id="full-width"
        label={property.key}
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state[property.key]}
        fullWidth
        margin="normal"
        key={property.key}
        onChange={this.handleChange(property.key)}
      />
    ));

    return (<React.Fragment>
      {finalCompo}
    </React.Fragment>);
  }
}

export default PropertiesForm;