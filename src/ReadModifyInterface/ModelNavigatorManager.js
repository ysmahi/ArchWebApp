import React from 'react'
import { Treebeard } from 'react-treebeard'
import _ from 'lodash'
import { getBranchSha, getElementContent, getNodeTreeRecursive } from '../Utils/GithubApiCall'
import { xml2json } from 'xml-js'

// Used : http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/

/* const data = {
  name: 'react-treebeard',
  toggled: true,
  children: [
    {
      name: 'example',
      children: [
        { name: 'app.js' },
        { name: 'data.js' },
        { name: 'index.html' },
        { name: 'styles.js' },
        { name: 'webpack.config.js' }
      ]
    },
    {
      name: 'node_modules',
      loading: true,
      children: []
    },
    {
      name: 'src',
      children: [
        {
          name: 'components',
          children: [
            { name: 'decorators.js' },
            { name: 'treebeard.js' }
          ]
        },
        { name: 'index.js' }
      ]
    },
    {
      name: 'themes',
      children: [
        { name: 'animations.js' },
        { name: 'default.js' }
      ]
    },
    { name: 'Gulpfile.js' },
    { name: 'index.js' },
    { name: 'package.json' }
  ]
};

let paths = [
  'FolderA/FolderB/FolderC/Item1',
  'FolderA/FolderB/Item1',
  'FolderB/FolderD/FolderE/Item1',
  'FolderB/FolderD/FolderE/Item2',
  'FolderA/FolderF/Item1',
  'ItemInRoot'
];
*/

class ModelNavigatorManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataNavigator: {
        name: 'Architecture Model',
        toggled: true,
        children: [],
      },
      alreadyToggled: ['']
    }
    this.onToggle = this.onToggle.bind(this);

  }

  componentDidMount() {
    getBranchSha('ysmahi', 'ArchiTest', 'master')
      .then((sha) => {
        getNodeTreeRecursive('ysmahi', 'ArchiTest', sha)
          .then((treeRecursive) => {
            let allUrlsTree = treeRecursive.map((element) => element.path);
            let tree = arrangeIntoTree(allUrlsTree);

            let dataNavigator = {
              name: 'Architecture Model',
              id:'',
              toggled: true,
              children: tree,
            }

            this.setState({dataNavigator: dataNavigator});
          })
      })
  }

  onToggle = (node, toggled) => {
    // node.id is the path to element in git repo
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });

    if (!(node.children.length > 0)) {
      // if a leaf is clicked
      getElementContent('ysmahi', 'ArchiTest', node.id)
        .then((content) => {
          let contentElement = atob(content);
          console.log('content', contentElement);
          let jsonContentElement = JSON.parse(xml2json(contentElement));
          this.props.dataElementHandler(jsonContentElement, node.id);
        })
    }

    //if a folder is clicked
    else if (node.children.length > 0) {
      // go into children folder to read name of parent folder in folder.xml

      if (!this.state.alreadyToggled.includes(node.id)) {
        // Checks if node already opened to avoid doing unnecessary requests

        // Filter to go only in folder children to find folder.xml
        let arrPromises = node.children.filter(child => child.children.length > 0)
          .map(child => {
            return new Promise((resolve, reject) => {
              resolve(getElementContent('ysmahi', 'ArchiTest', child.id + '/folder.xml'));
            })
          });

        // Async retrieval of all folder names
        Promise.all(arrPromises)
          .then((contentFolders) => {
            let treeNavig = this.state.dataNavigator;

            let jsonContentFolder = contentFolders.map(content => JSON.parse(xml2json(atob(content))));
            let nameFolders = jsonContentFolder.map(cont => cont.elements[0].attributes.name);
            let nodeCh = getNodeById(node.id, treeNavig).children.filter(el => el.children.length > 0);

            for (let i = 0; i < nameFolders.length; i++) {
              nodeCh[i].name = nameFolders[i];
            }

            this.setState({dataNavigator: treeNavig});
          })

        // Retrieval of leaves' name
        arrPromises = node.children.filter((child => (child.children.length === 0 && child.name !== 'folder.xml')))
          .map(child => {
            return new Promise((resolve, reject) => {
              resolve(getElementContent('ysmahi', 'ArchiTest', child.id));
            })
          });

        Promise.all(arrPromises)
          .then((contentElements) => {
            let treeNavigator = this.state.dataNavigator;
            let jsonContentElements = contentElements.map((content) => JSON.parse(xml2json(atob(content))));
            let nameElements = jsonContentElements.map(content => content.elements[0].attributes.name);
            let nodeToChange = getNodeById(node.id, treeNavigator);

            for (let i = 0; i < nameElements.length; i++) {
              nodeToChange.children[i].name = nameElements[i];
            }

            this.setState({dataNavigator: treeNavigator,
              alreadyToggled: this.state.alreadyToggled.concat(node.id)});
          })
      }
    }
  }

  render(){
    return (
      <Treebeard
        data={this.state.dataNavigator}
        onToggle={this.onToggle}
      />
    );
  }
}

let arrangeIntoTree = (paths) => {
  let tree = [];

  _.each(paths, (path) => {

    let pathParts = path.split('/');

    let currentLevel = tree; // initialize currentLevel to root

    _.each(pathParts, (part) => {

      // check to see if the path already exists.
      let existingPath = _.find(currentLevel, {
        name: part
      });

      if (existingPath) {
        // The path to this item was already in the tree, so don't add it again.
        // Set the current level to this path's children
        currentLevel = existingPath.children;
      }
      else {
        let newPart = {
          name: part,
          children: [],
          id: path,
        }

        currentLevel.push(newPart);
        currentLevel = newPart.children;
      }
    });
  });

  return tree;
}

export default ModelNavigatorManager;

let getNodeById = (id, node) => {
  // https://stackoverflow.com/questions/34903361/find-node-by-id-in-json-tree
  // to find the node with a specific id in tree
  var reduce = [].reduce;
  function runner(result, node){
    if(result || !node) return result;
    return node.id === id && node || //is this the proper node?
      runner(null, node.children) || //process this nodes children
      reduce.call(Object(node), runner, result);  //maybe this is some ArrayLike Structure
  }
  return runner(null, node);
}