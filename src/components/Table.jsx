import React, { Component } from "react";
import TableRow from "./TableRow";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import { Grid, List, Paper, Typography, Button } from "@material-ui/core";

class Table extends Component {
  state = {
    deleteConfirmation: {
      open: false,
      ids: []
    },
    selectedForDelete: null,
    selectedForEdit: null,
    selected: []
  };

  handleDeleteMany = ids => e => {
    this.setState({
      deleteConfirmation: {
        open: true,
        ids: ids
      }
    });
  };

  handleDelete = id => {
    // send delete request to backend

    console.log("id: ", id);

    // this.setState({
    //   reservations: this.state.reservations.filter(
    //     reservation => !ids.includes(reservation._id)
    //   ),
    //   selected: this.state.selected.filter(id => !ids.includes(id))
    // });
  };

  handleSelectAll = onlySomeSelected => (e, checked) => {
    if (onlySomeSelected || !checked) {
      this.setState({ selected: [] });
    } else {
      this.setState({ selected: this.state.reservations.map(res => res._id) });
    }
  };

  handleCheckboxChange = id => (e, checked) => {
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

  handleClose = willDelete => e => {
    this.setState({
      deleteConfirmation: {
        ...this.state.deleteConfirmation,
        open: false
      }
    });

    if (willDelete) this.handleDelete(this.state.deleteConfirmation.ids)();
  };

  handleClickRow = id => {
    this.setState({ selectedForEdit: id });
  };

  handleNewReservation = e => {
    let now = new Date();
    let later = new Date(now);
    later.setHours(17, 30, 0, 0);
  };

  handleSaveReservation = e => {
    let obj = this.state.selectedForEdit;
    this.setState({ selectedForEdit: null });

    if (this.state.selectedForEdit == null) {
      // post request

      delete obj._id;

      fetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          this.componentDidMount();
          console.log(res);
        });
    } else {
      // put request

      fetch("/api/reservations", {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          this.componentDidMount();
          console.log(res);
        });
    }
  };

  handleCancelEdit = e => {
    this.setState({
      selectedForEdit: null
    });
  };

  render() {
    return (
      <Paper style={{ padding: "1em 0", margin: "1em", textAlign: "center" }}>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Reservations
        </Typography>
        <List>
          <Grid container>
            {/* <TableRow
              head
              onDelete={this.handleDeleteMany(this.state.selected)}
              onCheckboxChange={this.handleSelectAll(
                this.state.selected.length &&
                  this.state.selected.length !== this.state.reservations.length
              )}
              selected={
                this.state.selected.length === this.state.reservations.length &&
                this.state.reservations.length !== 0
              }
              someSelected={this.state.selected.length}
              reservation={{
                playerid: "Space",
                name: "Reserved For",
                from: "From",
                to: "To"
              }}
            /> */}
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
            {this.props.reservations.map(doc => (
              <TableRow
                key={doc.id}
                selected={this.state.selected.includes(doc.id)}
                onDelete={this.handleDelete}
                onRowClick={this.handleClickRow}
                reservation={{ ...doc.data(), id: doc.id }}
                onCheckboxChange={this.handleCheckboxChange(doc.id)}
              />
            ))}
          </Grid>
        </List>
        <Button
          variant="outlined"
          color="primary"
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
          deleteConfirmation={this.state.deleteConfirmation}
          onClose={this.handleClose}
        />
        {this.state.selectedForEdit && (
          <EditDialog
            open
            onClose={this.handleCancelEdit}
            onSave={this.handleSaveReservation}
            reservation={this.props.reservations.find(
              res => res.id === this.state.selectedForEdit
            )}
          />
        )}
      </Paper>
    );
  }
}

export default Table;
