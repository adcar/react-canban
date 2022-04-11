import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  root: { marginBottom: theme.spacing(1) },
  divider: {
    marginTop: theme.spacing(1),
    backgroundColor: "#d1e0f0"
  }
}));

export default function ColumnHeader(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography
        variant={"h6"}
        component={"h2"}
        style={{ fontWeight: 600, color: "#8192a3" }}
      >
        {props.title}
      </Typography>
      <Divider className={classes.divider} />
    </div>
  );
}
