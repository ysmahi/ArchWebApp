import React from 'react';
import {Treebeard} from 'react-treebeard';

const data = {
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

class ModelNavigatorManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(node, toggled){
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
  }
  render(){
    return (
      <Treebeard
        data={data}
        onToggle={this.onToggle}
      />
    );
  }
}

export default ModelNavigatorManager;