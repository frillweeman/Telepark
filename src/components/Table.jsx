import React, { Component } from "react";
import TableRow from "./TableRow";
import TableHead from "./TableHead";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import { Grid, List, Paper, Typography, Button } from "@material-ui/core";

class Table extends Component {
  state = {
    deletePromptOpen: false,
    selectedForEdit: null,
    selected: []
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.reservations.length < this.props.reservations.length)
      this.setState({ selected: [] });
  }

  handleDeleteMany = () => {
    this.setState({
      deletePromptOpen: true
    });
  };

  handleDelete = id => {
    console.log("delete id: ", id);

    // send delete request to Firebase
    // it will auto-update the table
    this.props.onDeleteDocument(id);
  };

  handleSelectAll = (e, checked) => {
    this.setState({
      selected:
        checked && !this.state.selected.length
          ? this.props.reservations.map(res => res.id)
          : []
    });
  };

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

  handleClose = willDelete => e => {
    this.setState({
      deletePromptOpen: false
    });

    if (willDelete) this.props.onDeleteDocuments(this.state.selected);
  };

  handleClickRow = id => {
    this.setState({ selectedForEdit: id });
    console.log("edit id: ", id);
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
            <TableHead
              selected={
                this.state.selected.length &&
                this.state.selected.length === this.props.reservations.length
              }
              someSelected={this.state.selected.length}
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
            {this.props.reservations.map(doc => (
              <TableRow
                key={doc.id}
                selected={this.state.selected.includes(doc.id)}
                onDelete={this.handleDelete}
                onRowClick={this.handleClickRow}
                reservation={{ ...doc.data(), id: doc.id }}
                onCheckboxChange={this.handleRowCheckbox}
              />
            ))}
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
