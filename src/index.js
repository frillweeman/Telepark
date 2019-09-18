import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Table from "./components/Table";
import { Grid } from "@material-ui/core";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Grid container>
            <Grid item xs={12} md={8} lg={6}>
              <Table />
            </Grid>
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
