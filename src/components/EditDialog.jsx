/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

import "react-dates/initialize";
import React, { Component } from "react";
import PropTypes from "prop-types";
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
  constructor(props) {
    super(props);

    const res = this.props.reservation.data();

    const momentDates = {
      start: moment(res.from.toDate()),
      end: moment(res.to.toDate())
    };

    this.state = {
      id: this.props.reservation.id,
      for: res.for,
      spacesSelected: res.player_id,
      startDate: momentDates.start,
      endDate: momentDates.end,
      disabled: props.getConflictingReservation(
        momentDates.start,
        momentDates.end
      ),
      error: {
        for: false,
        space: false,
        endTime: false
      },
      focusedInput: null
    };
  }

  componentDidMount() {
    this.disableConflicts();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !prevState.startDate.isSame(this.state.startDate, "minute") ||
      !prevState.endDate.isSame(this.state.endDate, "minute")
    )
      this.disableConflicts();
  }

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
    const tomorrow = {
      start: moment().add(1, "days"),
      end: moment().add(1, "days")
    };

    tomorrow.start.set({ hour: 8, minute: 0, second: 0 });
    tomorrow.end.set({ hour: 17, minute: 0, second: 0 });

    this.setState({
      startDate: tomorrow.start,
      endDate: tomorrow.end
    });
  };

  isWeek = () => {
    const now = moment();
    const eow = this.getNextFriday();
    return (
      this.state.endDate.isSame(eow, "date") &&
      this.state.startDate.isSame(now, "date") &&
      !now.isSame(eow, "date")
    );
  };

  getNextFriday = () => {
    let today = moment();
    const wd = today.isoWeekday();

    if (wd <= 5) return today.isoWeekday(5);
    else return today.add(1, "weeks").isoWeekday(5);
  };

  setWeek = () => {
    const week = {
      start: moment(),
      end: this.getNextFriday()
    };

    week.end.set({ hour: 17, minute: 0, second: 0 });

    this.setState({
      startDate: week.start,
      endDate: week.end
    });
  };

  setToday = () => {
    const startDate = moment();
    const endDate =
      startDate.hour() >= 17
        ? moment().set({
            hour: 23,
            minute: 59,
            second: 0
          })
        : moment.set({
            hour: 17,
            minute: 0,
            second: 0
          });

    this.setState({
      startDate,
      endDate
    });
  };

  handleFieldChange = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleSelect = range => {
    if (range.startDate) {
      const now = moment();

      range.startDate.set({
        hour: range.startDate.isSame(now, "date")
          ? this.state.startDate.hour()
          : 8,
        minute: range.startDate.isSame(now, "date")
          ? this.state.startDate.minute()
          : 0,
        second: 0
      });
    }

    if (range.endDate)
      range.endDate.set({
        hour: this.state.endDate.hour(),
        minute: this.state.endDate.minute(),
        second: 0
      });

    this.setState({
      startDate: range.startDate || this.state.startDate,
      endDate: range.endDate || this.state.endDate
    });
  };

  handleTimeChange = key => e => {
    const splitTime = e.target.value.split(":");

    let newDate = moment(this.state[key]);

    newDate.set({
      hour: parseInt(splitTime[0]),
      minute: parseInt(splitTime[1]),
      second: 0
    });

    this.setState({
      [key]: newDate
    });
  };

  validateData = () => {
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

    if (this.state.endDate <= this.state.startDate) {
      errors.endTime = true;
      validData = false;
    }

    return { errors, validData };
  };

  disableConflicts = () => {
    const unavailableIDs = this.props.getConflictingReservation(
      this.state.startDate,
      this.state.endDate
    );

    this.setState({ disabled: unavailableIDs });
  };

  containsProfanity = () => {
    const uri = `https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(
      this.state.for
    )}`;
    fetch(uri)
      .then(data => {
        data.text().then(containsProfanity => {
          if (containsProfanity === "true") {
            this.setState({
              error: {
                ...this.state.error,
                for: true
              }
            });
          } else this.success();
        });
      })
      .catch(e => console.error(e));
  };

  handleSubmit = () => {
    const res = this.validateData();
    this.setState({ error: res.errors });
    if (!res.validData) return;

    this.containsProfanity();
  };

  success() {
    const newReservation = {
      for: this.state.for,
      player_id: this.state.spacesSelected,
      from: this.state.startDate.toDate(),
      to: this.state.endDate.toDate()
    };

    if (this.state.id === "new") this.props.onCreateDocument(newReservation);
    else this.props.onUpdateDocument(this.state.id, newReservation);

    this.closeDialog();
  }

  handleNewSpaces = spaces => {
    this.setState({ spacesSelected: spaces });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") this.handleSubmit();
  };

  render() {
    return (
      <ResponsiveDialog
        open
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
                  autoFocus={this.state.id === "new"}
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
                  readOnly
                  displayFormat="ddd M/DD"
                  numberOfMonths={1}
                  startDate={this.state.startDate}
                  startDateId="start"
                  endDate={this.state.endDate}
                  endDateId="end"
                  minimumNights={0}
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
                    value={this.state.startDate.format("HH:mm")}
                    onChange={this.handleTimeChange("startDate")}
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
                    value={this.state.endDate.format("HH:mm")}
                    onChange={this.handleTimeChange("endDate")}
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
                  disabled={this.state.disabled}
                  onChange={this.handleNewSpaces}
                  spacesSelected={this.state.spacesSelected}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>Cancel</Button>
          {this.state.id !== "new" && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={this.props.onDelete(this.state.id)}
            >
              Delete
            </Button>
          )}
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

function getCurrentWeekday(beginning) {
  const d = new Date();

  // if after hours, use next day
  if (d.getHours() >= 17) {
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0);
  }

  // if not on weekday, choose next monday
  if (!d.getDay() || d.getDay() > 5) {
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
    d.setHours(beginning ? 8 : 17, 0, 0);
  } else if (!beginning) {
    d.setHours(17, 0, 0);
  }
  console.log(d);
  return d;
}

EditDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateDocument: PropTypes.func.isRequired,
  onCreateDocument: PropTypes.func.isRequired,
  getConflictingReservation: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

EditDialog.defaultProps = {
  // emulate a Firestore document with default values
  reservation: {
    id: "new",
    data: () => ({
      for: "",
      from: getCurrentWeekday(true),
      to: getCurrentWeekday(false),
      player_id: []
    })
  }
};

export default EditDialog;
