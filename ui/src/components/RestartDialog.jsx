import React, { Component } from "react";
import {
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  FormHelperText,
  DialogActions,
  Button
} from "@material-ui/core";
import ResponsiveDialog from "./ResponsiveDialog";
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
      <ResponsiveDialog
        open
        onClose={this.props.onClose.bind(null, false)}
        onKeyPress={this.handleKeyPress}
      >
        <DialogTitle>Restart Devices</DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <FormControl style={{ width: "100%" }}>
            <FormLabel>Parking Space Selection</FormLabel>
            <FormHelperText style={{ marginBottom: "1em" }}>
              Select one or more parking spaces below.
            </FormHelperText>
            <SpaceSelector
              spacesSelected={[]}
              onChange={this.handleNewSpaces}
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
      </ResponsiveDialog>
    );
  }
}

export default RestartDialog;
