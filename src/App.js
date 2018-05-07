import React, { Component } from 'react'
import './App.css'
import { MuiThemeProvider } from 'material-ui'
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
