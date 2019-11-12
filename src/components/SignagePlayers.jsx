import React, { Component } from "react";
import Widget from "./Widget";
import RestartDialog from "./RestartDialog";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Container,
  Chip,
  FormLabel,
  Divider,
  Button,
  Snackbar,
  SnackbarContent,
  Icon,
  IconButton
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

class SignagePlayers extends Component {
  state = {
    restartOpen: false,
    displayUpdateSnackbar: false
  };

  openRestartDevices = e => {
    this.setState({
      restartOpen: true
    });
  };

  closeRestartDevices = success => {
    this.setState({
      restartOpen: false
    });
    this.setState({ displayUpdateSnackbar: success });
  };

  displayUpdateSnackbar = display => {
    this.setState({ displayUpdateSnackbar: display });
  };

  render() {
    return (
      <>
        <Widget title="Manage Signs">
          <Container>
            <Chip
              icon={<CheckCircleIcon />}
              label="All signs are connected"
              color="primary"
              size="small"
              clickable
              style={{ margin: "4px 0 14px 0" }}
            />
            <Divider />
            <FormGroup style={{ textAlign: "left", marginTop: 14 }}>
              <FormLabel>Appearance</FormLabel>
              <FormControlLabel
                label="Dark Theme"
                control={
                  <Switch
                    checked={this.props.darkTheme}
                    onChange={this.props.onThemeChange}
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <Divider />
            <FormGroup style={{ textAlign: "left", marginTop: 14 }}>
              <FormLabel>Power &amp; Troubleshooting</FormLabel>
              <Button
                onClick={this.openRestartDevices}
                style={{ marginTop: 14 }}
                color="secondary"
                variant="outlined"
              >
                Shutdown or Restart Device
              </Button>
              <Button
                disabled
                style={{ marginTop: 14 }}
                color="primary"
                variant="outlined"
              >
                Power On/Off TVs
              </Button>
            </FormGroup>
          </Container>
        </Widget>
        {this.state.restartOpen && (
          <RestartDialog
            onRestart={this.props.onRestart}
            onClose={this.closeRestartDevices}
          />
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.displayUpdateSnackbar}
          autoHideDuration={6000}
          onClose={this.displayUpdateSnackbar.bind(null, false)}
        >
          <SnackbarContent
            message={
              <span style={{ display: "flex", alignItems: "center" }}>
                <Icon
                  style={{
                    marginRight: this.props.theme.spacing(1)
                  }}
                >
                  <i className="material-icons">check_circle_icon</i>
                </Icon>
                Devices Restarting
              </span>
            }
            style={{
              backgroundColor: "green"
            }}
            action={[
              <IconButton
                onClick={this.displayUpdateSnackbar.bind(null, false)}
              >
                <i className="material-icons" style={{ color: "white" }}>
                  close
                </i>
              </IconButton>
            ]}
          ></SnackbarContent>
        </Snackbar>
      </>
    );
  }
}

export default SignagePlayers;
