/*
 * TO DO
 * - move # of spaces inline with name
 * - display data correctly in Edit Dialog
 * - implement updating document from Edit Dialog
 * - add create reservation functionality
 *
 * - decide whether to ask user for space or autochoose
 * - change space (player_id) to array, represent change
 */

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
  Container
} from "@material-ui/core";
import { DateRange } from "react-date-range";
const moment = require("moment");

// accept Firebase dates as well as standard dates
Date.prototype.toDate = function() {
  return this;
};

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

const calendarStyle = {
  DateRange: {
    background: "#ffffff"
  },
  Calendar: {
    background: "transparent",
    color: "#95a5a6",
    boxShadow: "0 0 1px #eee",
    width: "290px",
    padding: "0px"
  },
  MonthAndYear: {
    background: "#55B1E3",
    color: "#fff",
    padding: "20px 10px",
    height: "auto"
  },
  MonthButton: {
    background: "#fff"
  },
  MonthArrowPrev: {
    borderRightColor: "#55B1E3"
  },
  MonthArrowNext: {
    borderLeftColor: "#55B1E3"
  },
  Weekday: {
    background: "#3AA6DF",
    color: "#fff",
    padding: "10px",
    height: "auto",
    fontWeight: "normal"
  },
  Day: {
    transition: "transform .1s ease, box-shadow .1s ease, background .1s ease"
  },
  DaySelected: {
    background: "#55B1E3"
  },
  DayActive: {
    background: "#55B1E3",
    boxShadow: "none"
  },
  DayInRange: {
    background: "#eee",
    color: "#55B1E3"
  },
  DayHover: {
    background: "#4f4f4f",
    color: "#fff"
  }
};

class EditDialog extends Component {
  state = {
    id: this.props.id,
    for: this.props.reservation.for,
    numSpaces: 1,
    startDate: moment(this.props.reservation.from.toDate()),
    endDate: moment(this.props.reservation.to.toDate()),
    startTime: moment(this.props.reservation.from.toDate()),
    endTime: moment(this.props.reservation.to.toDate())
  };

  handleFieldChange = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleSelect = range => {
    this.setState(range);
  };

  handleTimeChange = key => e => {
    const splitTime = e.target.value.split(":");

    let newDate = this.state[key];
    newDate.set({
      hour: parseInt(splitTime[0]),
      minute: parseInt(splitTime[1]),
      second: 0
    });

    this.setState({
      [key]: newDate
    });
  };

  handleSubmit = () => {
    const newReservation = {
      for: this.state.for,
      player_id: "8R",
      from: this.state.startDate
        .set({
          hour: this.state.startTime.hour(),
          minute: this.state.startTime.minute(),
          second: 0
        })
        .toDate(),
      to: this.state.endDate
        .set({
          hour: this.state.endTime.hour(),
          minute: this.state.endTime.minute(),
          second: 0
        })
        .toDate()
    };

    if (this.state.id === "new") this.props.onCreateDocument(newReservation);
    else this.props.onUpdateDocument(this.state.id, newReservation);

    this.props.onClose();
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
          {this.state.id !== "new" ? "Edit" : "Create"} Reservation
        </DialogTitle>
        <DialogContent>
          <form autoComplete="off" noValidate>
            <FormControl
              style={{
                ...classes.formControl,
                width: "70%"
              }}
            >
              <TextField
                id="for"
                label="For"
                value={this.state.for}
                onChange={this.handleFieldChange("for")}
              />
            </FormControl>
            <FormControl
              style={{
                ...classes.formControl,
                ...classes.partialWidth,
                float: "right",
                width: "25%"
              }}
              disabled
            >
              <TextField
                id="qty"
                label="Number of Spaces"
                type="number"
                value="1"
              />
            </FormControl>
            <FormHelperText style={classes.formControl}>
              Note: Spaces automatically chosen prioritizing spaces near the
              front of the building and keeping group reservations together.
            </FormHelperText>
            <FormControl
              style={{
                ...classes.formControl
              }}
            >
              <DateRange
                calendars={1}
                theme={calendarStyle}
                onChange={this.handleSelect}
                disableDaysBeforeToday
                startDate={this.state.startDate}
                endDate={this.state.endDate}
              />
            </FormControl>
            <Container style={{ display: "inline" }}>
              <FormControl>
                <TextField
                  label="Start Time"
                  type="time"
                  value={this.state.startTime.format("HH:mm")}
                  onChange={this.handleTimeChange("startTime")}
                />
                <br />
                <TextField
                  label="End Time"
                  type="time"
                  value={this.state.endTime.format("HH:mm")}
                  onChange={this.handleTimeChange("endTime")}
                />
              </FormControl>
            </Container>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={this.handleSubmit}
          >
            {this.state.id !== "new" ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditDialog;
