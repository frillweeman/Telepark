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
    fontWeight: 600,
    textTransform: "uppercase"
  }
};

class TableHead extends Component {
  render() {
    return (
      <ListItem divider style={style.head}>
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
              disabled={!this.props.someSelected}
              onClick={this.props.onDelete}
            >
              <i className="material-icons">delete</i>
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item xs={2}>
          SPACE
        </Grid>
        <Grid item xs={4}>
          RESERVED FOR
        </Grid>
        <Grid item xs={3}>
          FROM
        </Grid>
        <Grid item xs={3}>
          TO
        </Grid>
      </ListItem>
    );
  }
}

export default TableHead;
