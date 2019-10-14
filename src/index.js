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
  Link
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
let reservationsCollectionRef = db.collection("reservations");
// End Firebase Configuration

class App extends React.Component {
  state = {
    reservations: [],
    validUser: true
  };

  // set up callback for real time database changes
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) console.log("current user: ", user);
      else firebase.auth().signInWithRedirect(provider);
    });

    reservationsCollectionRef.onSnapshot(
      snapshot => {
        this.setState({ reservations: snapshot.docs });
      },
      e => {
        this.setState({ validUser: false });
      }
    );
  }

  handleDeleteDocument = id => {
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
                </Paper>
              )
            ) : (
              <CircularProgress size={80} style={{ margin: "4em auto" }} />
            )}
          </Grid>
        </div>
      </ThemeProvider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

document.body.style.background = "#eeeeee";
document.body.style.margin = 0;
