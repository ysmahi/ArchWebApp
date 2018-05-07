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
        children: []
      }
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
          let jsonContentElement = JSON.parse(xml2json(contentElement));
          this.props.jsonElementHandler(jsonContentElement);
        })
    }

    //if a folder is clicked
    else if(node.children.length > 0) {
      // go into children folder to read name of parent folder in folder.xml
      let promises = node.children.filter(child=>child.children.length > 0)
        .map(child=>{
          return new Promise((resolve, reject)=> getElementContent('ysmahi', 'ArchiTest', child.id + '/folder.xml'))}
        );

      console.log('node children; ;', promises);
      console.log('type', Array.isArray(promises));

      Promise.all(node.children.filter(child=>child.children.length > 0)
        .map(child=>{
          return new Promise((resolve, reject)=> getElementContent('ysmahi', 'ArchiTest', child.id + '/folder.xml'))}
        ))
        .then(contentFolders=>{
          let jsonContentFolder = JSON.parse(xml2json(atob(contentFolders)));
          console.log('bouboub:', jsonContentFolder);
          })
      console.log('my children:', node.children);
      // TODO: retrieve name of folder in json, then change name of folder in this.dataNavigator.tree
      // Then setState
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