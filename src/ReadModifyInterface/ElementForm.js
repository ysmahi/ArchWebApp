import React from 'react'
import { Button, TextField } from 'material-ui'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

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

    this.state = {
      nameElement: 'Name',
      typeElement: 'typeElement',
      idElement:'ID',
      documentationElement: 'Documentation',
      propertiesElement: {},
      hasProperties: false,
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  componentDidUpdate() {
    if (this.state.idElement !== this.props.idElement){
      console.log('afficiififi', this.props.nameElement);

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
    console.log('rerednering', this.state.nameElement);

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
        {this.state.hasProperties && (<PropertiesForm arrayProperties={this.state.propertiesElement}/>)}
        </div>
        <Button size="medium" className={classes.button}
                onClick={()=>this.props.pushChanges(this.state.nameElement,
                  this.state.idElement,
                  this.state.documentationElement,
                  this.state.propertiesElement
                )}>
          Push changes
        </Button>
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
      value={property.value}
      fullWidth
      margin="normal"
      key={property.key}
    />
  ));

  return(<React.Fragment>
    {finalCompo}
  </React.Fragment>);
}