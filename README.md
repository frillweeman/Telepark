# Telepark Admin

## Overview

This ReactJS app allows Admissions employees at the University of Alabama in Huntsville (UAH) to manage reserved parking spaces. This repo contains the source code for the management interface. See [telepark-client](https://github.com/frillweeman/telepark-client) for the digital signage player app.

Telepark Admin was built using ReactJS and [Firebase](firebase.google.com). Firebase provides the database (Cloud Firestore) and hosting. The Firebase SDK is used within this app to manipulate reservations within the database. Users must be authenticated via their UAH Google account and authorized as an active Admissions employee to make any changes.

### How to Use

Visit `https://uahparking.web.app` and log in with your UAH Google account. Once you are approved by an admin, you will get access to manage parking reservations in SSB lot.

### Map of Space IDs
```
   to Sparkman Drive
_____     ___     _____
|[8L]             [8R]|
|[7L]             [7R]|
|[6L]             [6R]|
|[5L]             [5R]|
|[4L]             [4R]|
|[3L]             [3R]|
|[2L]             [2R]|
|[1L]             [1R]|

|-------- SSB --------|
```
