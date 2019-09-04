import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Table from "./components/Table";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { Grid } from "@material-ui/core";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <ResponsiveDrawer title="TelePark">
            <Grid container>
              <Grid item xs={12} sm={6} lg={4}>
                <Table />
              </Grid>
            </Grid>
          </ResponsiveDrawer>
        </div>
      </ThemeProvider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

document.body.style.background = "#eeeeee";
document.body.style.margin = 0;
