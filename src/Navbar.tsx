import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DayNightIcon from "@material-ui/icons/Brightness4";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    nav: {
      marginBottom: theme.spacing(2)
    }
  })
);

interface Callback {
  (): void;
}

interface IProps {
  onToggleTheme: Callback;
}

export default function ButtonAppBar({ onToggleTheme }: IProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.nav}>
        <Toolbar>
          <Typography variant="h6" component="h1" className={classes.title}>
            Canban
          </Typography>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={onToggleTheme}
          >
            <DayNightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
