import React, { Component } from 'react'
import './App.css'
import { Button, MuiThemeProvider, withStyles } from 'material-ui'
import ReadModifyInterface from './ReadModifyInterface/ReadModifyInterface'
import { getToken } from './Utils/GithubApiCall'
import cookie from 'react-cookies'
import PropTypes from 'prop-types'
import QueryInterface from './QueryInterface/QueryInterface'

const githubAppId = 'a256b8d17f75ee274bf3';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      displayedScreen: 'Query Interface',
    };

    this.redirectToGithub = this.redirectToGithub.bind(this);

  }

  redirectToGithub = () => {
    document.location.replace('https://github.com/login/oauth/authorize?client_id=' + githubAppId);
  }

  componentDidMount = () => {
    let searchUrl = document.location.pathname;
    let hasToken = cookie.load('token');

    if (searchUrl === '/redirect' && hasToken === undefined) {
      getToken().then((token)=>{
        cookie.save('token',token, {path:'/'});
        this.setState({token: token});
      });
    }
  }

  render() {
    const {classes} = this.props;
    console.log('state', this.state);
    console.log('has own prop', this.state.hasOwnProperty('token'));
    let hasToken = !(cookie.load('token') === undefined)

    return (<div className="App">
        <MuiThemeProvider>
        {hasToken && this.state.displayedScreen === 'Read or Modif Interface' && (
        <div>
          <ReadModifyInterface />
        </div>)}
        {hasToken && this.state.displayedScreen === 'Query Interface' && (
        <div>
          <QueryInterface />
        </div>)}
        {!hasToken && (
          <Button size="medium" className={classes.button}
                  onClick={this.redirectToGithub}>
            Connect with Github
          </Button>
        )}
        </MuiThemeProvider>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
