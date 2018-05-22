import React from 'react'
import { TextField, withStyles } from 'material-ui'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Send from '@material-ui/icons/Send';
import { getBranchSha, getElementContent, getNodeTreeRecursive } from '../Utils/GithubApiCall'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class QueryInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      result: '',
    };
  }

  /* Updates state in real time when user types in a text field */
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /* Launches query by creating tables and then querying them with the query in state */
  launchQuery = () => {
    let tableElements = [], tableProperties = [], relationProperties = [];
    let username = 'ysmahi', repoName = 'ArchiTest';

    // Retrieves data in the github repo
    getBranchSha(username, repoName, 'master')
      .then(sha=>{
        getNodeTreeRecursive(username, repoName, sha)
          .then(tree=>{
            // Get rid of all paths other than those from elements
            let pathElements = tree
              .filter(el=>(!el.path.includes('folder.xml')
                && !el.path.includes('README')
                && el.path.includes('.xml')
                && !el.path.includes('relations/')
                && !el.path.includes('diagrams/')))
              .map(el=>el.path);
            console.log('pathElmeents : ', pathElements);

            let arrPromises = pathElements
              .map(path => {
                return new Promise((resolve, reject) => {
                  resolve(getElementContent(username, repoName, path));
                })
              });

            /* Promise.all(arrPromises)
              .then(content=>{
                // elements
              }) */

          })
      })

  }

  render() {
    const {classes} = this.props;

    return (
      <div className='QueryInterface'>
        <TextField
          id="query"
          label="Query"
          placeholder='Type your query here'
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.query}
          onChange={this.handleChange('query')}
          className={classes.textField}
          margin="normal"
        />
        <Button className={classes.button}
                variant="raised"
                color="primary"
                onClick={()=>this.launchQuery()}>
          Launch Query
          <Send className={classes.rightIcon}/>
        </Button>
      </div>
    )
  }
}

QueryInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryInterface);