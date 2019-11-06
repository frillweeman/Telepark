import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  FormHelperText,
  DialogActions,
  Button,
  Container
} from "@material-ui/core";
import SpaceSelector from "./SpaceSelector";

class RestartDialog extends Component {
  state = {
    spaces: []
  };

  handleNewSpaces = spaces => {
    this.setState({
      spaces: spaces
    });
  };

  handleSubmit = () => {
    this.props.onRestart(this.state.spaces);
    this.props.onClose(true);
  };

  render() {
    return (
      <Dialog
        open
        onClose={this.props.onClose.bind(null, false)}
        onKeyPress={this.handleKeyPress}
      >
        <DialogTitle>Restart Devices</DialogTitle>
        <DialogContent>
          <FormControl style={{ width: "100%" }}>
            <FormLabel>Parking Space Selection</FormLabel>
            <FormHelperText style={{ marginBottom: "1em" }}>
              Select one or more parking spaces below.
            </FormHelperText>
            <SpaceSelector
              onChange={this.handleNewSpaces}
              spacesSelected={[]}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose.bind(null, false)}>Cancel</Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={this.handleSubmit}
          >
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RestartDialog;
