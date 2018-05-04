import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


export class EndTreeElement extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return(
      <div>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <InsertDriveFile />
          </ListItemIcon>
          <ListItemText inset primary={this.props.name} />
        </ListItem>
      </div>
    );
  }
}

export class CollapsableTreeElement extends React.Component {
  constructor(props){
    super(props);
  }

  state= {
    open: false,
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render(){
    return(
      <div>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText inset primary={this.props.name} />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}