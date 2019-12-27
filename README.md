# Telepark

Telepark is a digital signage-based parking space reservation system for the University of Alabama in Huntsville. It was created to replace BrightAuthor for managing the content of the digital signage displays in the parking lot of Student Services Building (SSB).

For more info on each component of the system, read the README in the respective subdirectory.

## Hardware Setup

See the [Hardware Setup Guide](#).

## Software Development

### Requirements

#### Node.js and npm

Node and npm are used extensively throughout this project as a JS runtime and package manager. Install [both of them](https://nodejs.org/en/download/) before continuing.

#### Firebase CLI

You will need to install the [Firebase CLI](https://firebase.google.com/docs/cli) (available for all platforms) to configure and deploy the project.

### Installation

1. Once the Firebase CLI is installed, run `firebase login` to login with the Google credentials of the owner of this Firebase project.

2. Run the install script `./install.sh` to install the npm modules required for this project.

### Build and Deploy

This project has been configured, with the configuration saved in `firebase.json` and `.firebaserc`. To build and deploy this project, run the build and deploy script `./build-deploy.sh`. 

Alternatively, you may run `npm build` to build a specific React app (ui or signage-player) along with `firebase deploy --only hosting:<target>`, where target is the target name defined in `.firebaserc`.

### More Info

This system uses Firebase (by Google Cloud) as a backend. In order to work with it, you need to be familiar with the following services offered by Firebase:
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (database)
- [Hosting](https://firebase.google.com/docs/hosting)
- [GCP PubSub](https://cloud.google.com/pubsub/docs/)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [Authentication](https://firebase.google.com/docs/auth)
