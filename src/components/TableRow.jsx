import React, { Component } from "react";
import {
  Grid,
  ListItem,
  IconButton,
  Checkbox,
  Hidden
} from "@material-ui/core";

const style = {
  // head: {
  //   color: "#5d5d5d",
  //   fontSize: "0.8em",
  //   textAlign: "center",
  //   paddingBottom: 0,
  //   fontWeight: 600
  // },
  body: {
    textAlign: "center"
  }
};

class TableRow extends Component {
  state = {};

  handleClickRow = e => {
    const edit = e.target.tagName === "DIV";

    if (edit) this.props.onRowClick(this.props.reservation.id);
    else this.props.onDelete(this.props.reservation.id);
  };

  render() {
    return (
      <ListItem button onClick={this.handleClickRow} divider style={style.body}>
        <Hidden xsDown>
          <Grid item sm={1}>
            <Checkbox
              checked={this.props.selected}
              onChange={this.props.onCheckboxChange}
            />
          </Grid>
          <Grid item sm={1}>
            <IconButton>
              <i className="material-icons">delete</i>
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item xs={2} style={!this.props.head ? { color: "#0088ff" } : {}}>
          {this.props.reservation.player_id}
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
          {this.props.reservation.for}
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
          {this.props.reservation.from.toDate().toLocaleTimeString([], {
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
          {this.props.reservation.to.toDate().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
          })}
        </Grid>
      </ListItem>
    );
  }
}

export default TableRow;
