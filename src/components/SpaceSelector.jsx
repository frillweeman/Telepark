import React, { Component } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const spacesPerSide = 8;

class SpaceSelector extends Component {
  state = {
    spacesSelected: this.props.spacesSelected
  };

  handleCheckboxChange = space => (e, checked) => {
    let spacesSelected = this.state.spacesSelected;
    if (checked) spacesSelected.push(space);
    else spacesSelected = spacesSelected.filter(el => el !== space);

    this.setState(
      { spacesSelected: spacesSelected },
      this.props.onChange.bind(this, spacesSelected)
    );
  };

  render() {
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
                  control={
                    <Checkbox
                      checked={this.state.spacesSelected.includes(
                        `${spacesPerSide - index}L`
                      )}
                      onChange={this.handleCheckboxChange(
                        `${spacesPerSide - index}L`
                      )}
                      color="primary"
                    />
                  }
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
                  control={
                    <Checkbox
                      checked={this.state.spacesSelected.includes(
                        `${spacesPerSide - index}R`
                      )}
                      onChange={this.handleCheckboxChange(
                        `${spacesPerSide - index}R`
                      )}
                      color="primary"
                    />
                  }
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
