import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
}));

interface Props {}

export const ApparatusDrawer: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
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
            // { text: "Pagination", link: "#" },
          ].map((data, index) => (
            <NavLink exact to={data.link}>
              <ListItem
                button
                key={index}
                // TODO: selected にするための state を管理 selected={true}
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
          {[
            { text: "Login", link: "/login" },
            { text: "Sign in", link: "/signin" },
          ].map((data, index) => (
            <NavLink exact to={data.link}>
              <ListItem
                button
                key={index}
                // TODO: selected にするための state を管理 selected={true}
                disableRipple
                disableTouchRipple
              >
                <ListItemText primary={data.text} />
              </ListItem>
            </NavLink>
          ))}
        </List>
      </div>
    </Drawer>
  );
};
