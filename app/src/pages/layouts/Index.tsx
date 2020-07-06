import React from "react";
import Nav from "./Nav";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import { v4 as uuidv4 } from "uuid";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: "64px",
  },
}));

interface Props {}

export const Index: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <div className="container">
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Apparatus
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Toolbar />
            <div className={classes.drawerContainer}>
              <List>
                {[
                  { text: "Item", link: "/item" },
                  { text: "Set", link: "#" },
                  { text: "List", link: "#" },
                  { text: "Sub", link: "/sub" },
                  { text: "Pagination", link: "#" },
                ].map((data, index) => (
                  <NavLink exact to={data.link} activeClassName="active">
                    <ListItem
                      button
                      key={index}
                      selected={true}
                      disableRipple
                      disableTouchRipple
                    >
                      <ListItemText primary={data.text} />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
              <Divider />
              <List>
                {["Login", "Singin"].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <div className="row">
              <div className="col-lg-12">{props.children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
