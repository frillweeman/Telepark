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
  state = {
    reservation: {
      ...this.props.reservation.data(),
      id: this.props.reservation.id
    },
    from: this.props.reservation
      .data()
      .from.toDate()
      .toLocaleTimeString([], {
        hour12: false,
        hour: "numeric",
        minute: "2-digit"
      }),
    to: this.props.reservation
      .data()
      .to.toDate()
      .toLocaleTimeString([], {
        hour12: false,
        hour: "numeric",
        minute: "2-digit"
      })
  };

  handleDayChange = e => {
    // if (e.target.value === "1")
    //   this.props.onChange({
    //     to: new Date().setDate(new Date().getDate() + 1)
    //   });
    // else
    //   this.props.onChange({
    //     to: new Date()
    //   });
  };

  handleTextFieldChange = sender => e => {
    this.props.onChange({
      [sender]: e.target.value
    });
  };

  handleTimeChange = sender => e => {
    this.setState({
      [sender]: e.target.value
    });

    const timeSection = e.target.value.split(":");

    let date = new Date();
    date.setHours(timeSection[0], timeSection[1], 0);
    let dateString = date.toUTCString();

    this.props.onChange({
      [sender]: dateString
    });
  };

  handleDateFieldChange = date => {
    if (!isNaN(date.getTime())) {
      this.props.onChange({
        to: date.toUTCString()
      });

      console.log("new to", this.state.reservation.to);
    }
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
          {this.state.reservation._id ? "Edit" : "Create"} Reservation
        </DialogTitle>
        <DialogContent>
          <form autoComplete="off" noValidate>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
            >
              <TextField
                id="for"
                label="for"
                value={this.state.reservation.for}
                onChange={this.handleTextFieldChange("for")}
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
                value={this.state.from}
                onChange={this.handleTimeChange("from")}
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
                value={this.state.to}
                onChange={this.handleTimeChange("to")}
                inputProps={{
                  step: 300
                }}
              />
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
              disabled
            >
              <FormLabel component="legend">Days</FormLabel>
              <RadioGroup
                aria-label="days"
                htmlFor="days"
                value={
                  new Date(this.state.reservation.to).getUTCDate() ===
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
              {new Date(this.state.reservation.to).getUTCDate() !==
                new Date().getUTCDate() && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    label="End Date"
                    value={new Date(this.state.reservation.to)}
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
          <Button
            color="primary"
            variant="outlined"
            onClick={this.props.onSave}
          >
            {this.state.reservation._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditDialog;
