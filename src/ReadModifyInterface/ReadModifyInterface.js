import React from 'react';
import ModelNavigatorManager from './ModelNavigatorManager';
import ElementForm from './ElementForm'
import { withStyles } from 'material-ui'
import './ReadModifyInterface.css'

const styles = {
}

class ReadModifyInterface extends React.Component {
  state = {
    displayedElementForm: '',
  }

  render () {
    return (
      <div className="TreeFormContainer">
        <div className='ModelNavigatorManager'>
          <ModelNavigatorManager />
        </div>
        <div className='ElementForm'>
          <ElementForm />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ReadModifyInterface);