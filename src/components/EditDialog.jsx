/*
 * TO DO
 *
 * - decide whether to ask user for space or autochoose
 * - change space (player_id) to array, represent change
 */

import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  FormLabel,
  Grid,
  FormHelperText,
  Chip
} from "@material-ui/core";
import { DateRange } from "react-date-range";
import SpaceSelector from "./SpaceSelector";
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
    // width: "100%",
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
    spacesSelected: this.props.reservation.player_id,
    startDate: moment(this.props.reservation.from.toDate()),
    endDate: moment(this.props.reservation.to.toDate()),
    startTime: moment(this.props.reservation.from.toDate()),
    endTime: moment(this.props.reservation.to.toDate()),
    specialDateSelection: null,
    error: {
      for: false,
      space: false,
      endTime: false
    }
  };

  closeDialog = () => {
    this.props.onClose();
  };

  isToday = () => {
    const now = moment();
    return (
      this.state.startDate.isSame(now, "date") &&
      this.state.endDate.isSame(now, "date")
    );
  };

  isTomorrow = () => {
    const tomorrow = moment().add(1, "days");
    const { startDate, endDate } = this.state;
    return (
      startDate.isSame(tomorrow, "date") && endDate.isSame(tomorrow, "date")
    );
  };

  setTomorrow = () => {
    const tomorrow = moment().add(1, "days");
    this.setState({
      startDate: tomorrow,
      endDate: tomorrow,
      startTime: this.state.startTime.set({ hour: 8, minute: 0, second: 0 }),
      endTime: this.state.endTime.set({ hour: 17, minute: 0, second: 0 }),
      specialDateSelection: "tomorrow"
    });
  };

  isWeek = () => {
    const now = moment();
    const eow = this.getNextFriday();
    return this.state.endDate.isSame(eow, "date") && !now.isSame(eow, "date");
  };

  getNextFriday = () => {
    let today = moment();
    const wd = today.isoWeekday();

    if (wd <= 5) return today.isoWeekday(5);
    else return today.add(1, "weeks").isoWeekday(5);
  };

  setWeek = () => {
    const today = moment();
    this.setState({
      startDate: today,
      endDate: this.getNextFriday(),
      specialDateSelection: "week",
      startTime: this.state.startTime.set({ hour: 8, minute: 0, second: 0 }),
      endTime: this.state.endTime.set({ hour: 17, minute: 0, second: 0 })
    });
  };

  setToday = () => {
    const today = moment();
    this.setState({
      startDate: today,
      endDate: today,
      specialDateSelection: "today"
    });
  };

  componentDidMount() {
    if (this.isToday()) this.setState({ specialDateSelection: "today" });
    else if (this.isWeek()) this.setState({ specialDateSelection: "week" });
    else if (this.isTomorrow())
      this.setState({ specialDateSelection: "tomorrow" });
  }

  handleFieldChange = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleSelect = range => {
    this.setState(range, this.componentDidMount);
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
    let validData = true;

    let errors = {
      space: false,
      for: false,
      endTime: false
    };

    // check for errors
    if (!this.state.spacesSelected.length) {
      validData = false;
      errors.space = true;
    }

    if (!this.state.for.length) {
      validData = false;
      errors.for = true;
    }

    if (this.state.endTime <= this.state.startTime) {
      alert("invalid end time");
      errors.endTime = true;
      validData = false;
    }

    this.setState({ error: errors });

    if (!validData) return;
    // end check

    const newReservation = {
      for: this.state.for,
      player_id: this.state.spacesSelected,
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

    this.closeDialog();
  };

  handleNewSpaces = spaces => {
    this.setState({ spacesSelected: spaces });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") this.handleSubmit();
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.closeDialog}
        fullWidth={true}
        maxWidth="sm"
        onKeyPress={this.handleKeyPress}
      >
        <DialogTitle>
          {this.state.id !== "new" ? "Edit" : "Create"} Reservation
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth style={classes.formControl}>
                <TextField
                  error={this.state.error.for}
                  id="for"
                  label="For"
                  value={this.state.for}
                  onChange={this.handleFieldChange("for")}
                  autoFocus
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                style={{
                  ...classes.formControl
                }}
              >
                <FormLabel>Date</FormLabel>
                <FormHelperText style={{ marginBottom: "1em" }}>
                  Select a date or date range on the calendar.
                </FormHelperText>
                <div style={{ marginBottom: "0.75em" }}>
                  <Chip
                    label="today"
                    color="primary"
                    clickable
                    onClick={this.setToday}
                    variant={
                      this.state.specialDateSelection !== "today" && "outlined"
                    }
                    style={{ marginRight: "0.75em" }}
                  />
                  <Chip
                    label="tomorrow"
                    color="primary"
                    clickable
                    onClick={this.setTomorrow}
                    variant={
                      this.state.specialDateSelection !== "tomorrow" &&
                      "outlined"
                    }
                    style={{ marginRight: "0.75em" }}
                  />
                  <Chip
                    label="this week"
                    color="primary"
                    clickable
                    onClick={this.setWeek}
                    variant={
                      this.state.specialDateSelection !== "week" && "outlined"
                    }
                  />
                </div>
                <DateRange
                  calendars={1}
                  theme={calendarStyle}
                  onChange={this.handleSelect}
                  disableDaysBeforeToday
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
                <FormLabel style={{ margin: "1em 0" }}>Time</FormLabel>
                <TextField
                  label="Start Time"
                  type="time"
                  style={{ paddingRight: "1em" }}
                  value={this.state.startTime.format("HH:mm")}
                  onChange={this.handleTimeChange("startTime")}
                />
                <br />
                <TextField
                  error={this.state.error.endTime}
                  label="End Time"
                  type="time"
                  style={{ paddingRight: "1em", marginBottom: "1em" }}
                  value={this.state.endTime.format("HH:mm")}
                  onChange={this.handleTimeChange("endTime")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl style={{ width: "95%", marginLeft: "1.2em" }}>
                <FormLabel error={this.state.error.space}>
                  Parking Space Selection
                </FormLabel>
                <FormHelperText
                  error={this.state.error.space}
                  style={{ marginBottom: "1em" }}
                >
                  Select one or more parking spaces below.
                </FormHelperText>
                <SpaceSelector
                  onChange={this.handleNewSpaces}
                  spacesSelected={this.props.reservation.player_id}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>Cancel</Button>
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
