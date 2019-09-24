import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  MenuItem,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Select,
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
    days: "0"
  };

  handleDayChange = e => {
    this.setState({ days: e.target.value });
  };

  render() {
    return (
      <Dialog open={true} fullWidth={true} maxWidth="sm">
        <DialogTitle>
          {this.props.new ? "Create" : "Edit"} Reservation
        </DialogTitle>
        <DialogContent>
          <form autoComplete="off" noValidate>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
            >
              <TextField id="name" label="Name" fullWidth />
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.partialWidth }}
            >
              <TextField
                id="start-time"
                label="Start Time"
                type="time"
                defaultValue={new Date().toLocaleTimeString([], {
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
                defaultValue="17:30"
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
                value={this.state.days}
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
              {this.state.days === "1" && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    label="End Date"
                    value={new Date().setDate(new Date().getDate() + 1)}
                    onChange={this.handleDayChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
              )}
            </FormControl>
            <FormControl
              style={{ ...classes.formControl, ...classes.fullWidth }}
              disabled
            >
              <InputLabel htmlFor="name-disabled">Parking Space</InputLabel>
              <Select
                value={"8R"}
                inputProps={{
                  name: "name",
                  id: "name-disabled"
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="8R">8R</MenuItem>
              </Select>
              <FormHelperText>
                Only space 8R is available during testing.
              </FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button color="primary" variant="outlined">
            {this.props.new ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditDialog;
