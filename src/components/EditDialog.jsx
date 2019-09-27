import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const classes = {
  formControl: {
    marginBottom: "1em"
  },
  fullWidth: {
    display: "block"
  },
  partialWidth: {
    marginRight: "1em"
  }
};

class EditDialog extends Component {
  state = {};

  handleDayChange = e => {
    if (e.target.value === "1")
      this.props.onChange({
        to: new Date().setDate(new Date().getDate() + 1)
      });
    else
      this.props.onChange({
        to: new Date()
      });
  };

  handleTextFieldChange = sender => e => {
    this.props.onChange({
      [sender]: e.target.value
    });
  };

  handleDateFieldChange = date => {
    if (!isNaN(date.getTime())) {
      this.props.onChange({
        to: date.toUTCString()
      });

      console.log("new to", this.props.reservation.to);
    }
  };

  handleSave = e => {
    // convert times to date strings

    this.props.onSave();
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
          {this.props.reservation.name.length ? "Edit" : "Create"} Reservation
        </DialogTitle>
        <DialogContent>
          <form autoComplete="off" noValidate>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
            >
              <TextField
                id="name"
                label="Name"
                value={this.props.reservation.name}
                onChange={this.handleTextFieldChange("name")}
                fullWidth
              />
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.partialWidth }}
            >
              <TextField
                id="start-time"
                label="Start Time"
                type="time"
                defaultValue={new Date(
                  this.props.reservation.from
                ).toLocaleTimeString([], {
                  hour12: false,
                  hour: "numeric",
                  minute: "2-digit"
                })}
                inputProps={{
                  step: 300
                }}
              />
            </FormControl>
            <FormControl style={classes.formControl}>
              <TextField
                id="end-time"
                label="End Time"
                type="time"
                defaultValue={new Date(
                  this.props.reservation.to
                ).toLocaleTimeString([], {
                  hour12: false,
                  hour: "numeric",
                  minute: "2-digit"
                })}
                inputProps={{
                  step: 300
                }}
              />
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
            >
              <FormLabel component="legend">Days</FormLabel>
              <RadioGroup
                aria-label="days"
                name="days"
                value={
                  new Date(this.props.reservation.to).getUTCDate() ===
                  new Date().getUTCDate()
                    ? "0"
                    : "1"
                }
                onChange={this.handleDayChange}
                row
              >
                <FormControlLabel
                  value="0"
                  control={<Radio color="primary" />}
                  label="Today Only"
                ></FormControlLabel>
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="Until Date"
                ></FormControlLabel>
              </RadioGroup>
              {new Date(this.props.reservation.to).getUTCDate() !==
                new Date().getUTCDate() && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    label="End Date"
                    value={new Date(this.props.reservation.to)}
                    onChange={this.handleDateFieldChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
              )}
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.partialWidth }}
              disabled
            >
              <TextField
                id="qty"
                label="Number of Spaces"
                type="number"
                value="1"
              />
              <FormHelperText>
                Note: Only space 8R is available during testing.
                <br />
                <br />
                Spaces automatically chosen prioritizing spaces near the front
                of the building and keeping group reservations together.
              </FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button color="primary" variant="outlined" onClick={this.handleSave}>
            {this.props.reservation.name.length ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditDialog;
