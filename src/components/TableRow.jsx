import React, { Component } from "react";
import {
  Grid,
  ListItem,
  IconButton,
  Checkbox,
  Hidden
} from "@material-ui/core";

const style = {
  head: {
    color: "#5d5d5d",
    fontSize: "0.8em",
    textAlign: "center",
    paddingBottom: 0,
    fontWeight: 600
  },
  body: {
    textAlign: "center"
  }
};

class TableRow extends Component {
  state = {
    disableRipple: true
  };

  render() {
    return (
      <ListItem
        button={!this.props.head}
        onClick={this.props.onDeleteClick}
        divider={!this.props.isLast}
        style={this.props.head ? style.head : style.body}
      >
        <Hidden xsDown>
          <Grid item sm={1}>
            <Checkbox
              checked={this.props.selected}
              indeterminate={this.props.someSelected && !this.props.selected}
              onChange={this.props.onCheckboxChange}
            />
          </Grid>
          <Grid item sm={1}>
            <IconButton
              disabled={
                (this.props.head && !this.props.someSelected) ||
                (!this.props.head && this.props.selected)
              }
              onClick={this.props.onDelete}
            >
              <i className="material-icons">delete</i>
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item xs={2} style={!this.props.head ? { color: "#0088ff" } : {}}>
          {this.props.reservation.playerid}
        </Grid>
        <Grid
          item
          xs={4}
          style={
            !this.props.head
              ? {
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }
              : {}
          }
        >
          {this.props.reservation.name}
        </Grid>
        <Grid
          item
          xs={3}
          style={
            !this.props.head
              ? { color: "red", whiteSpace: "nowrap", overflow: "hidden" }
              : {}
          }
        >
          {this.props.reservation.from.length < 5
            ? this.props.reservation.from
            : new Date(this.props.reservation.from).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
              })}
        </Grid>
        <Grid
          item
          xs={3}
          style={
            !this.props.head
              ? { color: "green", whiteSpace: "nowrap", overflow: "hidden" }
              : {}
          }
        >
          {this.props.reservation.to.length < 5
            ? this.props.reservation.to
            : new Date(this.props.reservation.to).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
              })}
        </Grid>
      </ListItem>
    );
  }
}

export default TableRow;
