import React from "react";
import { withStyles } from "@material-ui/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";
import {
  AppBar as AB,
  Button,
  Menu,
  MenuItem,
  Hidden
} from "@material-ui/core";

const styles = theme => ({
  account: {
    position: "absolute",
    top: theme.spacing(2),
    right: 10,
    color: "white"
  },
  icon: {
    paddingLeft: theme.spacing(1)
  }
});

function AppBar(props) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const { classes } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AB position="fixed">
      <img
        src="/telepark.svg"
        alt="telepark logo"
        style={{
          width: 220,
          padding: 10,
          margin: small ? theme.spacing(0, 2) : "auto"
        }}
      />
      {props.user && (
        <>
          <Button className={classes.account} onClick={handleClick}>
            <Hidden xsDown>
              Hello, {props.user.displayName.split(" ")[0]}
            </Hidden>
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
            <Hidden smUp>
              <MenuItem>{props.user.displayName}</MenuItem>
            </Hidden>
          </Menu>
        </>
      )}
    </AB>
  );
}

export default withStyles(styles)(AppBar);
