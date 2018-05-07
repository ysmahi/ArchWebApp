import axios from 'axios/index'

const apiUrl = 'https://api.github.com/';
const reposUrl = 'repos/';

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