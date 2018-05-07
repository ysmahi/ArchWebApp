import React from 'react'
import { TextField } from 'material-ui'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
  },
});

class ElementForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameElement: 'Name',
      typeElement: 'typeElement',
      idElement:'ID',
      documentationElement: 'Documentation',
      propertiesElement: {},
      hasProperties: false,
    }
  }

  componentDidUpdate() {
    if (this.state.idElement !== this.props.idElement){

      this.setState({
        nameElement: this.props.nameElement,
        typeElement: this.props.typeElement,
        idElement: this.props.idElement,
        documentationElement: this.props.documentationElement,
        propertiesElement: this.props.propertiesElement,
        hasProperties: this.props.hasProperties,
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
          placeholder={this.state.nameElement}
          fullWidth
          margin="normal"
        />
        <TextField
          id="full-width"
          label='Type'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={this.state.typeElement}
          fullWidth
          margin="normal"
        />
        <TextField
          id="full-width"
          label='ID'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={this.state.idElement}
          fullWidth
          margin="normal"
        />
        <TextField
          id="textarea"
          label="Documentation"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={this.state.documentationElement}
          multiline
          rows={4}
          className={classes.textField}
          margin="normal"
        />
        <div>
        {this.state.hasProperties && (<PropertiesForm arrayProperties={this.state.propertiesElement}/>)}
        </div>
      </div>
    );
  }
}

ElementForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ElementForm);

/* Creates the block of element properties text fields
 * Params: array of json defined properties {key: name_of_property,
  * value: value_of_property } */
const PropertiesForm = ({arrayProperties}) => {

  let finalCompo = arrayProperties.map((property) => (
    <TextField
      id="full-width"
      label={property.key}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder={property.value}
      fullWidth
      margin="normal"
      key={property.key}
    />
  ));

  return(<React.Fragment>
    {finalCompo}
  </React.Fragment>);
}