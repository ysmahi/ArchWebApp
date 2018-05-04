import React from 'react';
import { TextField } from 'material-ui'

class ElementForm extends React.Component {
  render () {
    return (
      <div>
        <TextField
          id="full-width"
          label="Name"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="My model element"
          fullWidth
          margin="normal"
        />
        <TextField
          id="full-width"
          label="Type of element"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Type 1"
          fullWidth
          margin="normal"
        />
      </div>
    );
  }
}

export default ElementForm;