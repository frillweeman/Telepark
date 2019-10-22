import React, { Component } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton
} from "@material-ui/core";
import Widget from "./Widget";

// add proptypes and defaults

class Users extends Component {
  state = {};

  handleRoleChange = id => e => {
    const newVal = e.target.value;

    let updatedObj = {};

    switch (newVal) {
      case "employee":
        updatedObj.isActiveEmployee = true;
        updatedObj.isAdmin = false;
        break;
      case "admin":
        updatedObj.isActiveEmployee = true;
        updatedObj.isAdmin = true;
        break;
      case "disabled":
        updatedObj.isActiveEmployee = false;
        updatedObj.isAdmin = false;
        break;
      default:
        break;
    }

    this.props.onRoleChange(id, updatedObj);
  };

  render() {
    return (
      <Widget>
        <Typography
          variant="h5"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          Manage Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.users.map(user => (
              <TableRow
                style={
                  !user.data().isActiveEmployee
                    ? {
                        backgroundColor: "#ffc04c"
                      }
                    : {}
                }
              >
                <TableCell>{user.data().name}</TableCell>
                <TableCell>
                  <Select
                    value={
                      user.data().isAdmin
                        ? "admin"
                        : user.data().isActiveEmployee
                        ? "employee"
                        : "disabled"
                    }
                    onChange={this.handleRoleChange(user.id)}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="disabled">Disabled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={this.props.onDelete.bind(null, user.id)}>
                    <i className="material-icons">delete</i>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Widget>
    );
  }
}

export default Users;
