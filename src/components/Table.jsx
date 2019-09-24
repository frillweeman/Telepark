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
    selectedForEdit: null,
    selected: [],
    reservations: [
      // {
      //   _id: "54759eb3c090d83494e2d806",
      //   playerid: "2L",
      //   name: "Dick Reeves",
      //   from: "now",
      //   to: "3:30 pm"
      // },
      // {
      //   _id: "54759eb3c090d83494e2d807",
      //   playerid: "7L",
      //   name: "Peter Reeves",
      //   from: "now",
      //   to: "5:30 pm"
      // },
      // {
      //   _id: "54759eb3c090d83494e2d808",
      //   playerid: "1R",
      //   name: "John Freeman",
      //   from: "now",
      //   to: "12:30 pm"
      // },
      // {
      //   _id: "54759eb3c090d83494e2d804",
      //   playerid: "3L",
      //   name: "Will Freeman",
      //   from: "8:00 am",
      //   to: "5:00 pm"
      // },
      // {
      //   _id: "54759eb3c090d83494e2d805",
      //   playerid: "5R",
      //   name: "Danner Cronise",
      //   from: "10:00 am",
      //   to: "3:00 pm"
      // }
    ]
  };

  componentDidMount() {
    fetch("/api/reservations")
      .then(res => res.json())
      .then(
        reservations => {
          this.setState({
            reservations: reservations
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log("there has been an error", error);
        }
      );
  }

  handleDeleteMany = ids => e => {
    this.setState({
      deleteConfirmation: {
        open: true,
        ids: ids
      }
    });
  };

  handleDelete = ids => e => {
    // send delete request to backend
    fetch("/api/reservations", {
      method: "DELETE",
      body: JSON.stringify({
        toDelete: ids
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => console.log(res));

    console.log("ids", ids);

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
      <Paper style={{ padding: "1em 0", margin: "1em", textAlign: "center" }}>
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
                playerid: "Space",
                name: "Reserved For",
                from: "From",
                to: "To"
              }}
            />
            {!this.state.reservations.length && (
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
        <Button variant="outlined" color="primary">
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
        <EditDialog new={true} />
      </Paper>
    );
  }
}

export default Table;
