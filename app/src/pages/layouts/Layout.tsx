import React from "react";
import Nav from "./Nav";
import { ApparatusDrawer } from "./ApparatusDrawer";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const drawerWidth = 240;
const navBarWidth = 64;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: navBarWidth,
  },
}));

interface Props {}

export const Layout: React.FC<Props> = (props) => {
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
      <div className="/*container*/">
        <div className={classes.root}>
          <CssBaseline />
          <Nav />
          <ApparatusDrawer />
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
