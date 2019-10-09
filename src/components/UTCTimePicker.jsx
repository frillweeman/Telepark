import React, { Component } from "react";

class UTCTimePicker extends Component {
  state = {};
  render() {
    return (
      <TextField
        id="start-time"
        label="Start Time"
        type="time"
        defaultValue={new Date(this.props.reservation.from).toLocaleTimeString(
          [],
          {
            hour12: false,
            hour: "numeric",
            minute: "2-digit"
          }
        )}
        inputProps={{
          step: 300
        }}
      />
    );
  }
}

export default UTCTimePicker;
