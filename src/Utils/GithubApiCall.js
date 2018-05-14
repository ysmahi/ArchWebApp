import axios from 'axios/index'
import * as qs from 'qs'
import cookie from 'react-cookies'

const apiUrl = 'https://api.github.com/';
const reposUrl = 'repos/';
const gatekeeperUrl = 'http://localhost:9999/authenticate/';

export let getToken = () => {
  return new Promise((resolve, reject) => {

    let code = qs.parse(window.location.search.slice(1)).code;

    axios.get(gatekeeperUrl + code)
      .then((response)=>{
        if(response.status === 200) {
          resolve(response.data.token);
          reject('Error in getToken');
        }
      })
    })
}

export let getBranchSha = (username, repoName, branchName) => {
  return new Promise(
    (resolve, reject) => {
      axios.get(apiUrl + reposUrl + username + '/' + repoName + '/branches/' + branchName)
        .then((response) => {
          if(response.status === 200) {
            let branchSha = response.data.commit.sha;
            resolve(branchSha);
            reject('Error in getBranchSha');
          }
        })
    }
  )
}

export let getNodeTreeRecursive = (username, repoName, BranchSha) => {
  return new Promise(
    (resolve, reject) => {
      axios.get(apiUrl + reposUrl + username + '/' + repoName + '/git/trees/' + BranchSha + '?recursive=1')
        .then((response) => {
          if(response.status === 200) {
            resolve(response.data.tree);
            reject('Error in getNodeTreeRecursive');
          }
        })
    }
  )
}

export let getElementContent = (username, repoName, pathElement) => {
  return new Promise(
    (resolve, reject) => {
      axios.get(apiUrl + reposUrl + username + '/' + repoName + '/contents/' + pathElement)
        .then((response) => {
          if (response.status === 200)
          {
            resolve(response.data.content);
            reject('Error in getElementContent');
          }
        })
    }
  )
}