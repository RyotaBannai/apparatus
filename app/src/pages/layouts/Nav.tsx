import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Layout() {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          Apparatus
        </Typography>
        {localStorage.getItem("logIn") === "0" ? (
          <>
            <NavLink exact to="/login">
              <Button color="inherit">Login</Button>
            </NavLink>
            <NavLink exact to="/signin">
              <Button color="inherit">Sign In</Button>
            </NavLink>
          </>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
}
