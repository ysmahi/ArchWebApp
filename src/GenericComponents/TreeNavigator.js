import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ListSubheader from 'material-ui/List/ListSubheader'
import List from 'material-ui/List'
import { CollapsableTreeElement, EndTreeElement } from './TreeElement'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class TreeNavigator extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List
          component="nav"
          subheader={<ListSubheader component="div">Tree Navigator</ListSubheader>}
        >
          <CollapsableTreeElement
          name="folder 1"
          children={<EndTreeElement name="file 1"/>}
          />
        </List>
      </div>
    )
  };
}

TreeNavigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TreeNavigator);