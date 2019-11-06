import React, { Component } from "react";
import { Checkbox, FormControlLabel, Tooltip } from "@material-ui/core";

const spacesPerSide = 8;

class SpaceSelector extends Component {
  state = {
    spacesSelected: this.props.spacesSelected
  };

  handleCheckboxChange = space => (e, checked) => {
    let spacesSelected = this.state.spacesSelected;
    if (checked) {
      if (space === "all")
        spacesSelected = [
          "1R",
          "2R",
          "3R",
          "4R",
          "5R",
          "6R",
          "7R",
          "8R",
          "1L",
          "2L",
          "3L",
          "4L",
          "5L",
          "6L",
          "7L",
          "8L"
        ];
      else spacesSelected.push(space);
    } else {
      if (space == "all") spacesSelected = [];
      else spacesSelected = spacesSelected.filter(el => el !== space);
    }

    this.setState(
      { spacesSelected: spacesSelected },
      this.props.onChange.bind(this, spacesSelected)
    );
  };

  render() {
    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
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
                  width: "30%",
                  textAlign: "center"
                }}
              >
                {!index && (
                  <Tooltip
                    placement="bottom"
                    title={
                      this.state.spacesSelected.length == spacesPerSide * 2
                        ? "Deselect All"
                        : "Select All"
                    }
                  >
                    <Checkbox
                      checked={
                        this.state.spacesSelected.length == spacesPerSide * 2
                      }
                      onChange={this.handleCheckboxChange("all")}
                      color="secondary"
                    />
                  </Tooltip>
                )}
              </td>
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
            <td style={{ width: "5%" }} />
          </tr>
        </tbody>
      </table>
    );
  }
}

export default SpaceSelector;
