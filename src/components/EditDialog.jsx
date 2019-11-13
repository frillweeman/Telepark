/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

import "react-dates/initialize";
import React, { Component } from "react";
import {
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
import ResponsiveDialog from "./ResponsiveDialog";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
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
    },
    focusedInput: null
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

  handleFieldChange = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleSelect = range => {
    // do not process until we have both start and end
    if (!(range.startDate && range.endDate)) return;
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

    const fullStartDate = this.state.startDate.set({
      hour: this.state.startTime.hour(),
      minute: this.state.startTime.minute(),
      second: 0
    });

    const fullEndDate = this.state.endDate.set({
      hour: this.state.endTime.hour(),
      minute: this.state.endTime.minute(),
      second: 0
    });

    const conflictingRes = this.props.getConflictingReservation(
      fullStartDate,
      fullEndDate,
      this.state.spacesSelected
    );

    if (conflictingRes) {
      const res = conflictingRes.data();
      alert(
        `Conflict with Existing Reservation\n\nFor: ${
          res.for
        }\nWhen: ${res.from
          .toDate()
          .toLocaleString()} - ${res.to
          .toDate()
          .toLocaleString()}\nSpaces: ${res.player_id.map(
          id => `${id} `
        )}\n\nPlease choose other spaces or times.`
      );
      return;
    }

    const newReservation = {
      for: this.state.for,
      player_id: this.state.spacesSelected,
      from: fullStartDate.toDate(),
      to: fullEndDate.toDate()
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
      <ResponsiveDialog
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
            <Grid item xs={12} sm={6} style={{ paddingRight: 10 }}>
              <FormControl style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}
                >
                  <FormLabel style={{ marginBottom: 10 }}>Date</FormLabel>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 10
                    }}
                  >
                    <Chip
                      label="Today"
                      color="primary"
                      clickable
                      onClick={this.setToday}
                      variant={this.isToday() ? "default" : "outlined"}
                      style={{ margin: 3 }}
                    />
                    <Chip
                      label="Tomorrow"
                      color="primary"
                      clickable
                      onClick={this.setTomorrow}
                      variant={this.isTomorrow() ? "default" : "outlined"}
                      style={{ margin: 3 }}
                    />
                    <Chip
                      label="Week"
                      color="primary"
                      clickable
                      onClick={this.setWeek}
                      variant={this.isWeek() ? "default" : "outlined"}
                      style={{ margin: 3 }}
                    />
                  </div>
                </div>
                <DateRangePicker
                  displayFormat="ddd M/DD"
                  numberOfMonths={1}
                  startDate={this.state.startDate}
                  startDateId="start"
                  endDate={this.state.endDate}
                  endDateId="end"
                  onDatesChange={this.handleSelect}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={focusedInput =>
                    this.setState({ focusedInput })
                  }
                />
                <div
                  style={{
                    display: "flex",
                    marginBottom: 20
                  }}
                >
                  <TextField
                    label="from"
                    type="time"
                    style={{
                      flex: 1,
                      marginRight: 2
                    }}
                    variant="outlined"
                    value={this.state.startTime.format("HH:mm")}
                    onChange={this.handleTimeChange("startTime")}
                  />
                  <br />
                  <TextField
                    error={this.state.error.endTime}
                    label="to"
                    type="time"
                    style={{
                      flex: 1,
                      marginLeft: 2,
                      textAlign: "center"
                    }}
                    variant="outlined"
                    value={this.state.endTime.format("HH:mm")}
                    onChange={this.handleTimeChange("endTime")}
                  />
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                style={{
                  width: "100%"
                }}
              >
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
      </ResponsiveDialog>
    );
  }
}

export default EditDialog;
