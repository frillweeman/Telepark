import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button
} from "@material-ui/core";

class DeleteDialog extends Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose(false)}>
        <DialogTitle>Delete Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {this.props.length} parking
            reservation
            {this.props.length > 1 ? "s" : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose(false)}>Cancel</Button>
          <Button onClick={this.props.onClose(true)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteDialog;
