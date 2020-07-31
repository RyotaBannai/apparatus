import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Collapse,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import GraphicEqOutlinedIcon from "@material-ui/icons/GraphicEqOutlined";
import LayersOutlinedIcon from "@material-ui/icons/LayersOutlined";
import NotesOutlinedIcon from "@material-ui/icons/NotesOutlined";
import GrainOutlinedIcon from "@material-ui/icons/GrainOutlined";
import CallMissedOutgoingOutlinedIcon from "@material-ui/icons/CallMissedOutgoingOutlined";

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
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface Props {}

export const ApparatusDrawer: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
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
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <LayersOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Workspace" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/list_workspace",
                  icon: <NotesOutlinedIcon />,
                },
                {
                  text: "Create",
                  link: "/create_workspace",
                  icon: <GrainOutlinedIcon />,
                },
                {
                  text: "Edit",
                  link: "#",
                  icon: <CallMissedOutgoingOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link}>
                  <ListItem
                    button
                    key={index}
                    className={classes.nested}
                    disableRipple
                    disableTouchRipple
                  >
                    <ListItemIcon>{data.icon}</ListItemIcon>
                    <ListItemText primary={data.text} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Collapse>
          {[
            { text: "Item", link: "/item" },
            { text: "Set", link: "#" },
            { text: "List", link: "#" },
            // { text: "Pagination", link: "#" },
          ].map((data, index) => (
            <NavLink exact to={data.link}>
              <ListItem button key={index} disableRipple disableTouchRipple>
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
