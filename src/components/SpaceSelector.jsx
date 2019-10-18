import React, { Component } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

class SpaceSelector extends Component {
  state = {
    spacesPerSide: 8
  };

  render() {
    const { spacesPerSide } = this.state;
    return (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[...Array(spacesPerSide)].map((f, index) => (
            <tr>
              <td
                style={{
                  width: "35%",
                  textAlign: "left",
                  borderBottom: "1px solid black",
                  borderTop: "1px solid black"
                }}
              >
                <FormControlLabel
                  label={`${spacesPerSide - index}L`}
                  labelPlacement="end"
                  control={<Checkbox color="primary" />}
                />
              </td>
              <td
                style={{
                  width: "30%"
                }}
              ></td>
              <td
                style={{
                  width: "35%",
                  textAlign: "right",
                  borderBottom: "1px solid black",
                  borderTop: "1px solid black"
                }}
              >
                <FormControlLabel
                  label={`${spacesPerSide - index}R`}
                  labelPlacement="start"
                  control={<Checkbox color="primary" />}
                />
              </td>
            </tr>
          ))}
          <tr style={{ paddingTop: "2em" }}>
            <td style={{ width: "5%" }} />
            <td style={{ width: "90%", textAlign: "center" }}>SSB Entrance</td>
            <td style={{ width: "55%" }} />
          </tr>
        </tbody>
      </table>
    );
  }
}

export default SpaceSelector;
