import React from "react";
import { withStyles } from "@material-ui/styles";
import { Paper } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: theme.spacing(2, 0),
    margin: theme.spacing(1),
    textAlign: "center"
  }
});

function Widget(props) {
  const { classes } = props;
  return <Paper className={classes.root}>{props.children}</Paper>;
}

export default withStyles(styles)(Widget);
