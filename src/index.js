import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Table from "./components/Table";
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

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

var db = firebase.firestore();
const usersCollectionRef = db.collection("users");
const reservationsCollectionRef = db.collection("reservations");
// End Firebase Configuration

class App extends React.Component {
  state = {
    reservations: [],
    validUser: false,
    lastDeletedReservation: null
  };

  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInWithRedirect(provider);
        return;
      }

      console.log("current user: ", user.uid);

      usersCollectionRef
        .doc(user.uid)
        .get()
        .then(doc => {
          console.log("is admin: ", doc.data().admin);
          if (doc.exists && doc.data().admin)
            this.setState({ validUser: true });
        })
        .catch(e => {
          console.log("user not in users database");
        });
    });
  }

  // set up callback for real time database changes
  componentDidMount() {
    reservationsCollectionRef.onSnapshot(snapshot => {
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
      .set(newDocument)
      .then(() => console.log("updated document"))
      .catch(e => console.error("error updating: ", e));
  };

  handleCreateDocument = newDocument => {
    reservationsCollectionRef
      .add(newDocument)
      .then(() => console.log("added document"))
      .catch(e => console.error("error adding document: ", e));
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
          <AppBar position="static">
            <img src="/telepark.svg" style={{ height: 50, padding: 10 }} />
          </AppBar>
          <Grid container>
            {firebase.auth().currentUser ? (
              this.state.validUser ? (
                <Grid item xs={12} md={8} lg={6}>
                  <Table
                    reservations={this.state.reservations}
                    onDeleteDocument={this.handleDeleteDocument}
                    onDeleteDocuments={this.handleDeleteDocuments}
                    onUpdateDocument={this.handleUpdateDocument}
                    onCreateDocument={this.handleCreateDocument}
                  />
                </Grid>
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
                  {firebase.auth().currentUser.email.includes("uah.edu") ? (
                    <React.Fragment>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "center", marginBottom: "1em" }}
                      >
                        Account Not Verified
                      </Typography>
                      <Typography variant="body1">
                        Your account has not been verified for use with this
                        application. Please&nbsp;
                        <Link href="mailto:wgf0002@uah.edu">
                          contact your manager
                        </Link>
                        &nbsp;for access.
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "center", marginBottom: "1em" }}
                      >
                        Wrong Account
                      </Typography>
                      <Typography variant="body1">
                        You are not signed in with a UAH Google account.
                        Please&nbsp;
                        <Link
                          href=""
                          onClick={() => {
                            firebase.auth().signOut();
                          }}
                        >
                          log out
                        </Link>
                        &nbsp;and try again.
                      </Typography>
                    </React.Fragment>
                  )}
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
