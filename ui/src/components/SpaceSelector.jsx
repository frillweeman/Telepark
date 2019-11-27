import React, { Component } from "react";
import PropTypes from "prop-types";
import { Checkbox, FormControlLabel, Tooltip } from "@material-ui/core";

const spacesPerSide = 8;

class SpaceSelector extends Component {
  state = {
    spacesSelected: this.props.spacesSelected
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.disabled !== this.props.disabled) {
      this.setState({
        spacesSelected: this.state.spacesSelected.filter(
          id => !this.props.disabled.includes(id)
        )
      });
    }
  }

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
        ].filter(id => !this.props.disabled.includes(id));
      else spacesSelected.push(space);
    } else {
      if (space === "all") spacesSelected = [];
      else spacesSelected = spacesSelected.filter(el => el !== space);
    }

    this.setState(
      { spacesSelected },
      this.props.onChange.bind(this, spacesSelected)
    );
  };

  isAllSelected = () => {
    return (
      this.state.spacesSelected.length ===
      spacesPerSide * 2 - this.props.disabled.length
    );
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        {[...Array(spacesPerSide)].map((f, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <FormControlLabel
              label={`${spacesPerSide - index}L`}
              labelPlacement="end"
              control={
                <Checkbox
                  disabled={this.props.disabled.includes(
                    `${spacesPerSide - index}L`
                  )}
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
            {!index && (
              <Tooltip
                placement="bottom"
                title={this.isAllSelected() ? "Deselect All" : "Select All"}
              >
                <Checkbox
                  checked={this.isAllSelected()}
                  onChange={this.handleCheckboxChange("all")}
                  color="secondary"
                />
              </Tooltip>
            )}
            <FormControlLabel
              label={`${spacesPerSide - index}R`}
              labelPlacement="start"
              control={
                <Checkbox
                  disabled={this.props.disabled.includes(
                    `${spacesPerSide - index}R`
                  )}
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
          </div>
        ))}
      </div>
    );
  }
}

SpaceSelector.propTypes = {
  disabled: PropTypes.array,
  spacesSelected: PropTypes.array,
  onChange: PropTypes.func.isRequired
};

SpaceSelector.defaultProps = {
  disabled: [],
  spacesSelected: []
};

export default SpaceSelector;
