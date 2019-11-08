import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Table from "./components/Table";
import Users from "./components/Users";
import {
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Snackbar,
  SnackbarContent,
  Button,
  IconButton,
  Icon
} from "@material-ui/core";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import AppBar from "./components/AppBar";
import SignagePlayers from "./components/SignagePlayers";

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
provider.setCustomParameters({ hd: "uah.edu", prompt: "select_account" });

firebase.initializeApp(firebaseConfig);

const createUser = firebase.functions().httpsCallable("createUser");
const restartDevices = firebase.functions().httpsCallable("restartDevices");
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

var db = firebase.firestore();
const usersCollectionRef = db.collection("users");
const reservationsCollectionRef = db.collection("reservations");
const globalConfigRef = db.collection("players").doc("global");
// End Firebase Configuration

class App extends React.Component {
  state = {
    reservations: [],
    validUser: false,
    admin: false,
    lastDeletedReservation: null,
    recentlyUpdated: null,
    users: [],
    darkTheme: false
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
            if (createUser())
              console.log(
                "added new user to users database, awaiting approval for write access"
              );
            else console.error("failed to add user to db");
          }
        });
      });
    });
  }

  // set up callback for real time database changes
  componentDidMount() {
    reservationsCollectionRef.orderBy("from", "asc").onSnapshot(snapshot => {
      let sortedArray = snapshot.docs.sort(
        (a, b) => a.data().to.toDate().getTime - b.data().to.toDate().getTime
      );
      this.setState({ reservations: sortedArray });
    });
    globalConfigRef.onSnapshot(doc => {
      this.setState({ darkTheme: doc.data().darkTheme });
    });
  }

  handleDeleteDocument = id => {
    // save in state as last deleted doc, show undo snackbar
    const resToDelete = this.state.reservations.find(res => res.id === id);
    this.displayDeleteSnackbar(resToDelete);
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
      .then(this.displayUpdateSnackbar.bind(null, "Updated"))
      .catch(e => console.error("error updating: ", e));
  };

  handleCreateDocument = newDocument => {
    reservationsCollectionRef
      .add({ ...newDocument, createdBy: firebase.auth().currentUser.uid })
      .then(this.displayUpdateSnackbar.bind(null, "Created"))
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

  handleDarkModeChange = e => {
    globalConfigRef.update({
      darkTheme: e.target.checked
    });
  };

  handleUndo = () => {
    this.handleCreateDocument(this.state.lastDeletedReservation.data());

    // clear last deleted from state
    this.setState({ lastDeletedReservation: null });
  };

  handleSignOut = () => {
    firebase.auth().signOut();
  };

  displayUpdateSnackbar = disp => {
    this.setState({
      lastDeletedReservation: disp ? null : this.state.lastDeletedReservation,
      recentlyUpdated: disp
    });
  };

  displayDeleteSnackbar = disp => {
    this.setState({
      lastDeletedReservation: disp,
      recentlyUpdated: disp ? null : this.state.recentlyUpdated
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <AppBar
            user={firebase.auth().currentUser}
            onSignOut={this.handleSignOut}
          />
          <Grid container style={{ marginTop: 70, padding: theme.spacing(1) }}>
            {firebase.auth().currentUser ? (
              this.state.validUser ? (
                <>
                  <Grid item xs={12} lg={6}>
                    <Table
                      reservations={this.state.reservations}
                      onDeleteDocument={this.handleDeleteDocument}
                      onDeleteDocuments={this.handleDeleteDocuments}
                      onUpdateDocument={this.handleUpdateDocument}
                      onCreateDocument={this.handleCreateDocument}
                    />
                  </Grid>
                  {this.state.admin && (
                    <>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Users
                          users={this.state.users}
                          onRoleChange={this.handleUpdateUser}
                          onDelete={this.handleDeleteUser}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <SignagePlayers
                          darkTheme={this.state.darkTheme}
                          onThemeChange={this.handleDarkModeChange}
                          onRestart={restartDevices}
                          theme={theme}
                        />
                      </Grid>
                    </>
                  )}
                </>
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
                  <>
                    <Typography
                      variant="h6"
                      style={{ textAlign: "center", marginBottom: "1em" }}
                    >
                      You're in the Queue
                    </Typography>
                    <Typography variant="body1">
                      Your account hasn't been authorized yet. Hang tight while
                      your manager reviews your account for approval.
                    </Typography>
                  </>
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
            onClose={this.displayDeleteSnackbar.bind(null, false)}
            message="Reservation Deleted"
            action={[
              <Button color="secondary" size="small" onClick={this.handleUndo}>
                UNDO
              </Button>,
              <IconButton
                onClick={this.displayDeleteSnackbar.bind(null, false)}
              >
                <i className="material-icons" style={{ color: "white" }}>
                  close
                </i>
              </IconButton>
            ]}
          />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.recentlyUpdated}
            autoHideDuration={6000}
            onClose={this.displayUpdateSnackbar.bind(null, false)}
          >
            <SnackbarContent
              message={
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Icon
                    style={{
                      marginRight: theme.spacing(1)
                    }}
                  >
                    <i className="material-icons">check_circle_icon</i>
                  </Icon>
                  {`Reservation ${this.state.recentlyUpdated || ""}`}
                </span>
              }
              style={{
                backgroundColor: "green"
              }}
              action={[
                <IconButton
                  onClick={this.displayUpdateSnackbar.bind(null, false)}
                >
                  <i className="material-icons" style={{ color: "white" }}>
                    close
                  </i>
                </IconButton>
              ]}
            ></SnackbarContent>
          </Snackbar>
        </div>
      </ThemeProvider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

document.body.style.background = "#eeeeee";
document.body.style.margin = 0;
