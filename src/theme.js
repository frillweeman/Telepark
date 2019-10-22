import { createMuiTheme } from "@material-ui/core";
import { blue, red, orange } from "@material-ui/core/colors";

const theme = createMuiTheme({
  spacing: 8,
  palette: {
    primary: blue,
    secondary: orange,
    error: red
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(",")
  }
});

export default theme;
