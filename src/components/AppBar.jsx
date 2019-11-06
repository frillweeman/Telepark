import React from "react";
import { withStyles } from "@material-ui/styles";
import { AppBar as AB, Button, Menu, MenuItem } from "@material-ui/core";

const styles = theme => ({
  logo: {
    position: "relative"
  },
  account: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: "white"
  },
  icon: {
    paddingLeft: theme.spacing(1)
  }
});

function AppBar(props) {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AB position="fixed" className={classes.root}>
      <img
        className={classes.logo}
        src="/telepark.svg"
        alt="telepark logo"
        style={{ height: 50, padding: 10 }}
      />{" "}
      {props.test}
      {props.user && (
        <>
          <Button className={classes.account} onClick={handleClick}>
            Hello, {props.user.displayName.split(" ")[0]}
            <i className={`${classes.icon} material-icons`}>account_circle</i>
          </Button>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={props.onSignOut}>Sign Out</MenuItem>
          </Menu>
        </>
      )}
    </AB>
  );
}

export default withStyles(styles)(AppBar);
