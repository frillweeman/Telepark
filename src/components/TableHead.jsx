import React from "react";
import {
  Grid,
  ListItem,
  IconButton,
  Checkbox,
  Hidden
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

function TableHead(props) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const style = {
    head: {
      color: "#5d5d5d",
      fontSize: "0.8em",
      textAlign: "center",
      paddingBottom: small ? 10 : 0,
      fontWeight: 600,
      textTransform: "uppercase"
    }
  };

  return (
    <ListItem divider style={style.head}>
      <Hidden xsDown>
        <Grid item sm={1}>
          <Checkbox
            checked={props.selected}
            indeterminate={props.someSelected && !props.selected}
            onChange={props.onCheckboxChange}
          />
        </Grid>
        <Grid item sm={1}>
          <IconButton disabled={!props.someSelected} onClick={props.onDelete}>
            <i className="material-icons">delete</i>
          </IconButton>
        </Grid>
      </Hidden>
      <Grid item xs={2}>
        SPACE
      </Grid>
      <Grid item xs={4}>
        RESERVED FOR
      </Grid>
      <Grid item xs={3}>
        FROM
      </Grid>
      <Grid item xs={3}>
        TO
      </Grid>
    </ListItem>
  );
}

export default TableHead;
