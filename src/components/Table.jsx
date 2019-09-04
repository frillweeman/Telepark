import React, { Component } from "react";
import TableRow from "./TableRow";
import DeleteDialog from "./DeleteDialog";
import DeleteSnackBar from "./DeleteSnackBar";
import { Grid, List, Paper, Typography } from "@material-ui/core";

class Table extends Component {
  state = {
    deleteConfirmation: {
      open: false,
      ids: []
    },
    selectedForEdit: null,
    selected: [],
    reservations: [
      {
        _id: "54759eb3c090d83494e2d806",
        spaceid: "2L",
        name: "Dick Reeves",
        from: "now",
        to: "3:30 pm"
      },
      {
        _id: "54759eb3c090d83494e2d807",
        spaceid: "7L",
        name: "Peter Reeves",
        from: "now",
        to: "5:30 pm"
      },
      {
        _id: "54759eb3c090d83494e2d808",
        spaceid: "1R",
        name: "John Freeman",
        from: "now",
        to: "12:30 pm"
      },
      {
        _id: "54759eb3c090d83494e2d804",
        spaceid: "3L",
        name: "Will Freeman",
        from: "8:00 am",
        to: "5:00 pm"
      },
      {
        _id: "54759eb3c090d83494e2d805",
        spaceid: "5R",
        name: "Danner Cronise",
        from: "10:00 am",
        to: "3:00 pm"
      }
    ]
  };

  handleDeleteMany = ids => e => {
    this.setState({
      deleteConfirmation: {
        open: true,
        ids: ids
      }
    });
  };

  handleDelete = ids => e => {
    this.setState({
      reservations: this.state.reservations.filter(
        reservation => !ids.includes(reservation._id)
      ),
      selected: this.state.selected.filter(id => !ids.includes(id))
    });
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

  handleEditRequest = reservation => e => {
    if (e.target.tagName !== "DIV") return;
    this.setState({ selectedForEdit: reservation });
  };

  render() {
    return (
      <Paper style={{ padding: "1em 0 0 0", margin: "1em" }}>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Reservations
        </Typography>
        <List>
          <Grid container>
            <TableRow
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
                spaceid: "Space",
                name: "Reserved For",
                from: "From",
                to: "To"
              }}
            />
            {this.state.reservations.map((reservation, i) => (
              <TableRow
                key={i}
                selected={this.state.selected.includes(reservation._id)}
                onDelete={this.handleDelete([reservation._id])}
                onClick={this.handleEditRequest(reservation)}
                reservation={reservation}
                isLast={i === this.state.reservations.length - 1}
                onCheckboxChange={this.handleCheckboxChange(reservation._id)}
              />
            ))}
          </Grid>
        </List>
        <DeleteDialog
          deleteConfirmation={this.state.deleteConfirmation}
          onClose={this.handleClose}
        />
        <DeleteSnackBar />
      </Paper>
    );
  }
}

export default Table;
