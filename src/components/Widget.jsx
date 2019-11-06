import React from "react";
import { withStyles } from "@material-ui/styles";
import { Paper, Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: theme.spacing(2, 0),
    margin: theme.spacing(1),
    textAlign: "center",
    overflow: "hidden"
    // height: "100%"
  }
});

function Widget(props) {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Typography
        variant="h6"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        {props.title}
      </Typography>
      {props.children}
    </Paper>
  );
}

export default withStyles(styles)(Widget);
