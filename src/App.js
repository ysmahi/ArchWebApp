import React, { Component } from 'react';
import './App.css';
import { MuiThemeProvider } from 'material-ui'
import TreeNavigator from './GenericComponents/TreeNavigator'
import ModelNavigatorManager from './ReadModifyInterface/ModelNavigatorManager'
import ReadModifyInterface from './ReadModifyInterface/ReadModifyInterface'
// import StartingInterface from './StartingInterface';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <ReadModifyInterface />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
