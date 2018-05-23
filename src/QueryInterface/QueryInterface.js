import React from 'react'
import { TextField, withStyles } from 'material-ui'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'
import { getBranchSha, getElementContent, getNodeTreeRecursive } from '../Utils/GithubApiCall'
import { xml2json } from 'xml-js'
import * as cookie from 'react-cookies'
import * as alasql from 'alasql'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
      response: '',
      tablesCreated: false,
      copied:false,
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
    if(this.state.tablesCreated) {
      let response = alasql(this.state.query);
      this.setState({response: response});
    }

    else {
      let username = 'ysmahi', repoName = 'ArchiTest';
      let token = cookie.load('token');

      // Retrieves data in the github repo
      getBranchSha(username, repoName, 'master', token)
        .then(sha => {
          getNodeTreeRecursive(username, repoName, sha, token)
            .then(tree => {
              // Build array of element paths
              let pathElements = tree
                .filter(el => (!el.path.includes('folder.xml')
                  && el.path.includes('.xml')
                  && !el.path.includes('relations/')
                  && !el.path.includes('diagrams/')))
                .map(el => el.path);

              // build array of relations paths
              let pathRelations = tree
                .filter(el => (!el.path.includes('folder.xml')
                  && el.path.includes('.xml')
                  && el.path.includes('relations/')
                  && !el.path.includes('diagrams/')))
                .map(el => el.path);

              let arrPromises = pathElements
                .map(path => {
                  return new Promise((resolve, reject) => {
                    resolve(getElementContent(username, repoName, path, token));
                  })
                });

              Promise.all(arrPromises)
                .then(contents => {
                  // build an array with elements data
                  let decodedContents = contents.map(content => JSON.parse(xml2json(atob(content))));
                  let arrayElements = decodedContents.map(el => {
                    return {
                      id: el.elements[0].attributes.id,
                      type: el.elements[0].name,
                      name: el.elements[0].attributes.name
                    }
                  });

                  // build an array of element properties
                  let arrayProperties = decodedContents.filter(el => el.elements[0].hasOwnProperty('elements'))
                    .map(el => {
                      return el.elements[0].elements.map(elProp => {
                        return {
                          id: el.elements[0].attributes.id,
                          key: elProp.attributes.key,
                          value: elProp.attributes.value,
                        }
                      })
                    })
                    .reduce((arr1, arr2) => arr1.concat(arr2), []);

                  // Build array of Promises that will return content of relations
                  let arrPromisesRelations = pathRelations
                    .map(path => {
                      return new Promise((resolve, reject) => {
                        resolve(getElementContent(username, repoName, path, token));
                      })
                    });

                  Promise.all(arrPromisesRelations)
                    .then(contents => {
                      // build an array with relations data
                      let decodedRel = contents.map(content => JSON.parse(xml2json(atob(content))));
                      let arrayRelations = decodedRel.map(el => {
                        let nameRel = '';
                        if(typeof el.elements[0].attributes.name!=='undefined'){
                          nameRel = el.elements[0].attributes.name;
                        }

                        return {
                          id: el.elements[0].attributes.id,
                          type: el.elements[0].name.split(':')[1],
                          name: nameRel,
                          source: el.elements[0].elements[0].attributes.href.split("#")[1],
                          target:el.elements[0].elements[1].attributes.href.split("#")[1],
                        }
                      });

                      // Create tables
                      alasql('CREATE TABLE Elements');
                      alasql('CREATE TABLE Properties');
                      alasql('CREATE TABLE Relations');

                      // Fill tables
                      alasql.tables.Elements.data = arrayElements;
                      alasql.tables.Properties.data = arrayProperties;
                      alasql.tables.Relations.data = arrayRelations;

                      // Return query response
                      let response = alasql(this.state.query);
                      this.setState({response: response,
                        tablesCreated:true,});

                    })

                })

            })
        })
    }

  }

  /* Goes to the url where RAWGraphs is hosted */
  confirmData = () => {
    document.location.replace('http://localhost:4000');
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
        {this.state.response !== '' && (
          <div>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-amount">Response</InputLabel>
            <Input
              id="queryResponse"
              multiline
              value={JSON.stringify(this.state.response, null, 4)}
              onChange={this.handleChange('response')}
            />
          </FormControl>
          <CopyToClipboard text={JSON.stringify(this.state.response, null, 4)}
          onCopy={() => this.setState({copied: true})}>
          <Button className={classes.button}
          variant="raised"
          color="primary"
          onClick={()=>this.confirmData()}>
          Copy data and confirm
          <Send className={classes.rightIcon}/>
          </Button>
          </CopyToClipboard>
          </div>)}
      </div>
    )
  }
}

QueryInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryInterface);