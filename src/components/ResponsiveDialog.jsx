import React from "react";
import { Dialog } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

export default function ResponsiveDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog fullScreen={fullScreen} {...props}>
      {props.children}
    </Dialog>
  );
}
