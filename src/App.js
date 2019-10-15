// 8:57 pm - 11:00 pm (2 hours)

import React, { Component } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const schedule = require("node-schedule");
const qs = require("query-string");

const firebaseConfig = {
  apiKey: "AIzaSyDZyV2s2Uf0QZPQQAJE-OIdsxzFOrWsX8w",
  authDomain: "telepark-3df33.firebaseapp.com",
  databaseURL: "https://telepark-3df33.firebaseio.com",
  projectId: "telepark-3df33",
  storageBucket: "telepark-3df33.appspot.com",
  messagingSenderId: "183825692647",
  appId: "1:183825692647:web:6af323bc5f709215baaf42"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
let reservationsCollectionRef = db.collection("reservations");

const inPast = date => date < new Date();

class App extends Component {
  state = {
    reservations: [],
    activeReservation: null,
    schedule: {
      start: [],
      end: []
    },
    error: null
  };

  removeCollisions = date => {
    // find reservations where end time (.to) is same as start time (date)
    if (!this.state.reservations) return;
    const result = this.state.reservations.find(
      doc =>
        doc
          .data()
          .to.toDate()
          .getTime() === date.getTime()
    );
    if (result) {
      result.cancel();
      this.setState({
        schedule: {
          start: [...this.state.schedule.start],
          end: this.state.schedule.end.filter(event => event.name !== result.id)
        }
      });
    }
  };

  isStartEventAtTime = date => {
    if (!this.state.reservations) return false;
    return !!this.state.reservations.find(
      doc =>
        doc
          .data()
          .from.toDate()
          .getTime() === date.getTime()
    );
  };

  addReservation = doc => {
    const reservation = doc.data();
    if (inPast(reservation.to.toDate())) {
      console.log("Reservation overdue (not scheduled): ", reservation);
      return;
    }

    // schedule reservation
    if (inPast(reservation.from.toDate())) {
      // update immediately
      this.setContent(doc.id);
    } else {
      // cancel existing end events that would occur during this start event
      this.removeCollisions(reservation.from.toDate());

      // create start event
      this.state.schedule.start.push(
        schedule.scheduleJob(doc.id, reservation.from.toDate(), () => () =>
          this.setContent(doc.id)
        )
      );
    }

    // if there's start event at end time, DO NOT create end event
    if (!this.isStartEventAtTime(reservation.to.toDate())) {
      // create end event
      this.state.schedule.end.push(
        schedule.scheduleJob(doc.id, reservation.to.toDate(), () =>
          this.setContent(null)
        )
      );
    }
  };

  modifyReservation = change => {
    // todo: optimize by ignoring changes to non-time fields
    this.cancelEventById(change.doc.id);
    this.addReservation(change.doc);
  };

  componentDidUpdate() {
    console.log("active reservation: ", this.state.activeReservation);
  }

  cancelEventById = id => {
    // if is ongoing, end now
    // if (id === this.state.activeReservation) this.setContent(null);

    // cancel start and end events
    const { start, end } = this.state.schedule;
    try {
      start.find(event => event.name === id).cancel();
      end.find(event => event.name === id).cancel();
    } catch (err) {
      if (err instanceof TypeError) console.log("no start event found");
    }

    // remove start and end events from array
    this.setState({
      schedule: {
        start: start.filter(event => event.name !== id),
        end: end.filter(event => event.name !== id)
      }
    });
  };

  setContent = id => {
    // set active reservation, remove corresponding event from array
    this.setState({
      activeReservation: id || null,
      schedule: {
        start: id
          ? this.state.schedule.start.filter(event => event.name !== id)
          : this.state.schedule.start,
        end: id
          ? this.state.schedule.end
          : this.state.schedule.end.filter(event => event.name !== id)
      }
    });
  };

  scheduleChanges(docChanges) {
    docChanges.forEach(change => {
      console.log("change.type: ", change.type);
      switch (change.type) {
        case "added":
          this.addReservation(change.doc);
          break;
        case "modified":
          this.modifyReservation(change);
          break;
        case "removed":
          this.cancelEventById(change.doc.id);
          break;
        default:
          console.log("error scheduling change: ", change);
          break;
      }
    });
  }

  componentDidMount() {
    try {
      const player_id = qs
        .parse(this.props.location.search, { ignoreQueryPrefix: true })
        .id.toUpperCase();
      console.log("player-id: ", player_id);
      reservationsCollectionRef
        .where("player_id", "==", player_id)
        .onSnapshot(snapshot => {
          this.setState(
            {
              reservations: snapshot.docs,
              activeReservation: snapshot.docs.find(
                doc => doc.id === this.state.activeReservation
              )
                ? this.state.activeReservation
                : null
            },
            () => this.scheduleChanges(snapshot.docChanges())
          );
        });
    } catch (e) {
      if (e instanceof TypeError) this.setState({ error: "Invalid Player ID" });
    }
  }

  render() {
    const { activeReservation } = this.state;

    return (
      <div
        className="App"
        style={{ position: "relative", height: "100vh", margin: 0 }}
      >
        <h1
          style={{
            fontSize: "10vh",
            fontFamily: '"Avenir", sans-serif',
            fontWeight: 500,
            position: "absolute",
            top: "8vh",
            lineHeight: 1.4,
            color: "#0088ce"
          }}
        >
          {activeReservation
            ? `Welcome ${
                this.state.reservations
                  .find(doc => doc.id === activeReservation)
                  .data().for
              }`
            : this.state.error || "Reserved Visitor Parking"}
        </h1>
        <img
          style={{
            width: "80%",
            position: "absolute",
            left: "10%",
            bottom: "8vh"
          }}
          src="https://firebasestorage.googleapis.com/v0/b/telepark-3df33.appspot.com/o/uahlogo.svg?alt=media&token=653c9caa-7f42-459b-8729-28792f292301"
        ></img>
      </div>
    );
  }
}

export default App;
