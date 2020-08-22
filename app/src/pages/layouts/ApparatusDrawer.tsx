import React, { useState, FC } from "react";
import { NavLink } from "react-router-dom";
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
import LayersOutlinedIcon from "@material-ui/icons/LayersOutlined";
import NotesOutlinedIcon from "@material-ui/icons/NotesOutlined";
import GrainOutlinedIcon from "@material-ui/icons/GrainOutlined";
import CallMissedOutgoingOutlinedIcon from "@material-ui/icons/CallMissedOutgoingOutlined";
import ScatterPlotIcon from "@material-ui/icons/ScatterPlot";
import SpaceBarIcon from "@material-ui/icons/SpaceBar";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import { useStyles } from "../../assets/style/layout/drawer.style";
import { v4 as uuidv4 } from "uuid";

// TODO: open unOpen の状態を localStorage で管理する
interface Props {}

export const ApparatusDrawer: FC<Props> = (props) => {
  const classes = useStyles();
  const [openWS, setOpenWS] = useState(false);
  const [openItem, setOpenItem] = useState(true);
  const [openSet, setOpenSet] = useState(true);
  const [openList, setOpenList] = useState(true);
  const [openFolder, setOpenFolder] = useState(false);

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
          <ListItem
            button
            onClick={() => setOpenWS(!openWS)}
            disableRipple
            disableTouchRipple
            className={classes.listParent}
          >
            <ListItemIcon>
              <LayersOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Workspace" />
            {openWS ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openWS} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/workspace_list",
                  icon: <NotesOutlinedIcon />,
                },
                {
                  text: "Edit",
                  link: "/workspace_edit",
                  icon: <CallMissedOutgoingOutlinedIcon />,
                },
                {
                  text: "Create",
                  link: "/workspace_create",
                  icon: <GrainOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link} key={uuidv4()}>
                  <ListItem
                    button
                    key={data.text}
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
          <Divider />
          <ListItem
            button
            onClick={() => setOpenItem(!openItem)}
            disableRipple
            disableTouchRipple
            className={classes.listParent}
          >
            <ListItemIcon>
              <ScatterPlotIcon />
            </ListItemIcon>
            <ListItemText primary="Item" />
            {openItem ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openItem} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/item_list",
                  icon: <NotesOutlinedIcon />,
                },
                {
                  text: "Create",
                  link: "/item_create",
                  icon: <GrainOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link} key={uuidv4()}>
                  <ListItem
                    button
                    key={data.text}
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
          <Divider />
          <ListItem
            button
            onClick={() => setOpenSet(!openSet)}
            disableRipple
            disableTouchRipple
            className={classes.listParent}
          >
            <ListItemIcon>
              <SpaceBarIcon />
            </ListItemIcon>
            <ListItemText primary="Set" />
            {openSet ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSet} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/set_list",
                  icon: <NotesOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link} key={uuidv4()}>
                  <ListItem
                    button
                    key={data.text}
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
          <Divider />
          <ListItem
            button
            onClick={() => setOpenList(!openList)}
            disableRipple
            disableTouchRipple
            className={classes.listParent}
          >
            <ListItemIcon>
              <ViewHeadlineIcon />
            </ListItemIcon>
            <ListItemText primary="List" />
            {openList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/list_list",
                  icon: <NotesOutlinedIcon />,
                },
                {
                  text: "Create",
                  link: "/list_create",
                  icon: <GrainOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link} key={uuidv4()}>
                  <ListItem
                    button
                    key={data.text}
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
          <Divider />
          <ListItem
            button
            onClick={() => setOpenFolder(!openFolder)}
            disableRipple
            disableTouchRipple
            className={classes.listParent}
          >
            <ListItemIcon>
              <ViewColumnIcon />
            </ListItemIcon>
            <ListItemText primary="Folder" />
            {openFolder ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openFolder} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                {
                  text: "List",
                  link: "/folder_list",
                  icon: <NotesOutlinedIcon />,
                },
                {
                  text: "Create",
                  link: "/folder_create",
                  icon: <GrainOutlinedIcon />,
                },
              ].map((data, index) => (
                <NavLink exact to={data.link} key={uuidv4()}>
                  <ListItem
                    button
                    key={data.text}
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
        </List>
        <Divider />
        <List>
          {[
            { text: "Login", link: "/login" },
            { text: "Sign in", link: "/signin" },
          ].map((data, index) => (
            <NavLink exact to={data.link} key={uuidv4()}>
              <ListItem
                button
                key={data.text}
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
