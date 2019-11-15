import React, { Component } from "react";
import TableRow from "./TableRow";
import TableHead from "./TableHead";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import Widget from "./Widget";
import { Grid, List, Button } from "@material-ui/core";
const moment = require("moment");

class Table extends Component {
  state = {
    deletePromptOpen: false,
    selectedForEdit: null,
    selected: []
  };

  getConflictingReservation = (startTime, endTime) => {
    const { reservations } = this.props;
    if (!reservations.length) return [];

    let unavailableIDs = [];

    for (let res in reservations) {
      let { from, to, player_id } = reservations[res].data();

      // make moment dates from Firebase Timestamp
      from = moment(from.toDate());
      to = moment(to.toDate());

      if (
        startTime.isBetween(from, to, "minute", "()") ||
        endTime.isBetween(from, to, "minute", "()") ||
        from.isBetween(startTime, endTime, "minute", "()") ||
        (from.isSame(startTime, "minute") && to.isSame(endTime, "minute"))
      ) {
        for (let id in player_id) {
          if (!unavailableIDs.includes(player_id[id])) {
            unavailableIDs.push(player_id[id]);
          }
        }
      }
    }

    return unavailableIDs;
  };

  // ToDo: if reservation deleted, remove its document id from selected[]
  // right now, it just empties the array (not optimal)
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.reservations.length < this.props.reservations.length)
      this.setState({ selected: [] });
  }

  // delete many (open dialog)
  handleDeleteMany = () => {
    this.setState({
      deletePromptOpen: true
    });
  };

  // delete many dialog closed
  handleClose = willDelete => {
    this.setState({
      deletePromptOpen: false
    });

    if (willDelete) this.props.onDeleteDocuments(this.state.selected);
  };

  // select all checkbox is changed
  handleSelectAll = (e, checked) => {
    this.setState({
      selected:
        checked && !this.state.selected.length
          ? this.props.reservations.map(res => res.id)
          : []
    });
  };

  // individual checkbox change in a row
  handleRowCheckbox = (id, checked) => {
    if (checked) {
      this.setState({
        selected: [...this.state.selected, id]
      });
    } else {
      this.setState({
        selected: this.state.selected.filter(value => value !== id)
      });
    }
  };

  // row is clicked for edit
  handleClickRow = id => {
    this.setState({ selectedForEdit: id });
    console.log("edit id: ", id);
  };

  // create reservation clicked
  handleNewReservation = e => {
    this.setState({ selectedForEdit: "new" });
  };

  handleCancelEdit = (id = null) => e => {
    this.setState(
      {
        selectedForEdit: null
      },
      () => {
        if (id) this.props.onDeleteDocument(id);
      }
    );
  };

  render() {
    return (
      <Widget title="Reservations">
        <List>
          <Grid container>
            <TableHead
              selected={Boolean(
                this.state.selected.length &&
                  this.state.selected.length === this.props.reservations.length
              )}
              someSelected={Boolean(this.state.selected.length)}
              onCheckboxChange={this.handleSelectAll}
              onDelete={this.handleDeleteMany}
            />
            {!this.props.reservations.length && (
              <div
                style={{
                  textAlign: "center",
                  margin: "auto",
                  padding: "1em 0 0.3em 0",
                  color: "#343434"
                }}
              >
                - No Reservations -
              </div>
            )}
            <div
              style={{
                width: "100%"
              }}
            >
              {this.props.reservations.map(doc => (
                <TableRow
                  key={doc.id}
                  selected={this.state.selected.includes(doc.id)}
                  onDelete={this.props.onDeleteDocument}
                  onRowClick={this.handleClickRow}
                  reservation={{ ...doc.data(), id: doc.id }}
                  onCheckboxChange={this.handleRowCheckbox}
                />
              ))}
            </div>
          </Grid>
        </List>
        <Button
          variant="outlined"
          color="primary"
          style={{ marginTop: 5 }}
          onClick={this.handleNewReservation}
        >
          <i
            className="material-icons"
            style={{
              marginRight: "0.5em"
            }}
          >
            add
          </i>
          Create Reservation
        </Button>
        <DeleteDialog
          open={this.state.deletePromptOpen}
          length={this.state.selected.length}
          onClose={this.handleClose}
        />
        {this.state.selectedForEdit && (
          <EditDialog
            onClose={this.handleCancelEdit(null)}
            onDelete={this.handleCancelEdit}
            onUpdateDocument={this.props.onUpdateDocument}
            onCreateDocument={this.props.onCreateDocument}
            getConflictingReservation={this.getConflictingReservation}
            reservation={this.props.reservations.find(
              res => res.id === this.state.selectedForEdit
            )}
          />
        )}
      </Widget>
    );
  }
}

export default Table;
