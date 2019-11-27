import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  Tooltip
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
      <Widget title="Manage Users">
        <Table style={{ width: "100%" }}>
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
                key={user.id}
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
                  <Tooltip title="Change Role" placement="left">
                    <Select
                      style={{
                        fontSize: "0.85rem"
                      }}
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
                  </Tooltip>
                </TableCell>
                <TableCell style={{ padding: "0.2rem" }}>
                  <Tooltip title="Delete User" placement="top">
                    <IconButton
                      onClick={this.props.onDelete.bind(null, user.id)}
                    >
                      <i className="material-icons">delete</i>
                    </IconButton>
                  </Tooltip>
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
