import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Table from "./components/Table";
import Users from "./components/Users";
import {
  Grid,
  AppBar,
  Typography,
  CircularProgress,
  Paper,
  Link,
  Snackbar,
  Button,
  IconButton
} from "@material-ui/core";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZyV2s2Uf0QZPQQAJE-OIdsxzFOrWsX8w",
  authDomain: "telepark-3df33.firebaseapp.com",
  databaseURL: "https://telepark-3df33.firebaseio.com",
  projectId: "telepark-3df33",
  storageBucket: "telepark-3df33.appspot.com",
  messagingSenderId: "183825692647",
  appId: "1:183825692647:web:6af323bc5f709215baaf42"
};

var provider = new firebase.auth.GoogleAuthProvider();
// provider.setCustomParameters({ hd: "uah.edu" });

firebase.initializeApp(firebaseConfig);

const createUser = firebase.functions().httpsCallable("createUser");
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

var db = firebase.firestore();
const usersCollectionRef = db.collection("users");
const reservationsCollectionRef = db.collection("reservations");
// End Firebase Configuration

class App extends React.Component {
  state = {
    reservations: [],
    validUser: false,
    admin: false,
    lastDeletedReservation: null,
    users: []
  };

  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInWithRedirect(provider);
        return;
      }

      console.log("current user: ", user.uid);

      usersCollectionRef.onSnapshot(snapshot => {
        this.setState({ users: snapshot.docs }, () => {
          let u = this.state.users.find(u => u.id === user.uid);
          if (u) {
            this.setState({
              admin: u.data().isAdmin,
              validUser: u.data().isActiveEmployee
            });
          } else {
            console.log(
              "added new user to users database, awaiting approval for write access"
            );
            createUser();
          }
        });
      });
    });
  }

  // set up callback for real time database changes
  componentDidMount() {
    reservationsCollectionRef.orderBy("from", "asc").onSnapshot(snapshot => {
      this.setState({ reservations: snapshot.docs });
    });
  }

  handleDeleteDocument = id => {
    // save in state as last deleted doc, show undo snackbar
    const resToDelete = this.state.reservations.find(res => res.id === id);
    this.setState({ lastDeletedReservation: resToDelete });
    reservationsCollectionRef
      .doc(id)
      .delete()
      .then(() => console.log("document deleted"))
      .catch(e => console.error("error deleting: ", e));
  };

  handleDeleteDocuments = ids => {
    let batch = db.batch();
    for (let id in ids) {
      batch.delete(reservationsCollectionRef.doc(ids[id]));
    }
    batch
      .commit()
      .then(() => console.log(`deleted ${ids.length} docs`))
      .catch(e => console.log("error deleting: ", e));
  };

  handleUpdateDocument = (id, newDocument) => {
    reservationsCollectionRef
      .doc(id)
      .set({ ...newDocument, createdBy: firebase.auth().currentUser.uid })
      .then(() => console.log("updated document"))
      .catch(e => console.error("error updating: ", e));
  };

  handleCreateDocument = newDocument => {
    reservationsCollectionRef
      .add({ ...newDocument, createdBy: firebase.auth().currentUser.uid })
      .then(() => console.log("added document"))
      .catch(e => console.error("error adding document: ", e));
  };

  handleUpdateUser = (id, newData) => {
    usersCollectionRef
      .doc(id)
      .update(newData)
      .then(() => {
        console.log(`updated user ${id} with data: ${newData}`);
      })
      .catch(e => {
        console.error("error updating user: ", e);
      });
  };

  handleDeleteUser = id => {
    usersCollectionRef
      .doc(id)
      .delete()
      .then(() => console.log(`user ${id} deleted`))
      .catch(e => console.error("error deleting: ", e));
  };

  handleUndo = () => {
    this.handleCreateDocument(this.state.lastDeletedReservation.data());

    // clear last deleted from state
    this.setState({ lastDeletedReservation: null });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="fixed">
            <img src="/telepark.svg" style={{ height: 50, padding: 10 }} />
          </AppBar>
          <Grid container style={{ marginTop: 70 }}>
            {firebase.auth().currentUser ? (
              this.state.validUser ? (
                <React.Fragment>
                  <Grid item xs={12} md={8} lg={6}>
                    <Table
                      reservations={this.state.reservations}
                      onDeleteDocument={this.handleDeleteDocument}
                      onDeleteDocuments={this.handleDeleteDocuments}
                      onUpdateDocument={this.handleUpdateDocument}
                      onCreateDocument={this.handleCreateDocument}
                    />
                  </Grid>
                  {this.state.admin && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Users
                        users={this.state.users}
                        onRoleChange={this.handleUpdateUser}
                        onDelete={this.handleDeleteUser}
                      />
                    </Grid>
                  )}
                </React.Fragment>
              ) : (
                <Paper
                  style={{
                    padding: "1.5em",
                    margin: "2em auto",
                    textTransform: "none",
                    maxWidth: 600
                  }}
                >
                  {" "}
                  <React.Fragment>
                    <Typography
                      variant="h6"
                      style={{ textAlign: "center", marginBottom: "1em" }}
                    >
                      Account Not Authorized
                    </Typography>
                    <Typography variant="body1">
                      Your account has not been authorized for use with this
                      application. Please&nbsp;
                      <Link
                        href={`mailto:wgf0002@uah.edu?subject=Digital%20Signage%20Access&body=Digital%20Signage%20Access%20Request%0A%0AName%3A%20${encodeURI(
                          firebase.auth().currentUser.displayName
                        )}%0AEmail%3A%20${encodeURI(
                          firebase.auth().currentUser.email
                        )}`}
                      >
                        contact your manager
                      </Link>
                      &nbsp;for access.
                    </Typography>
                  </React.Fragment>
                </Paper>
              )
            ) : (
              <CircularProgress size={80} style={{ margin: "4em auto" }} />
            )}
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.lastDeletedReservation}
            autoHideDuration={6000}
            onClose={() => {
              this.setState({ lastDeletedReservation: null });
            }}
            message="Reservation Deleted"
            action={[
              <Button color="secondary" size="small" onClick={this.handleUndo}>
                UNDO
              </Button>,
              <IconButton
                onClick={() => {
                  this.setState({ lastDeletedReservation: null });
                }}
              >
                <i className="material-icons" style={{ color: "white" }}>
                  close
                </i>
              </IconButton>
            ]}
          />
        </div>
      </ThemeProvider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

document.body.style.background = "#eeeeee";
document.body.style.margin = 0;
