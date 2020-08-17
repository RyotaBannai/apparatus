import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import red from "@material-ui/core/colors/red";
import { inherits } from "util";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.complex,
      }),
    },
    name: {
      width: "50%",
      "& input": {
        padding: theme.spacing(1),
      },
    },
    description: {
      width: "50%",
      "& textarea": {
        minHeight: 100,
      },
    },
    gridButtonArea: {
      width: "50%",
    },
    gridName: {
      width: "100%",
    },
    gridDescription: {
      width: "100%",
    },
    cancelEditButton: {
      backgroundColor: red[50],
      "&:hover": {
        backgroundColor: red[100],
      },
      "&:focus": {
        outlineColor: red[100],
      },
    },
    addableAppBar: {
      color: "#000",
      backgroundColor: grey[300],
      borderRadius: 5,
      margin: "10px 0 25px 0",
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      "& h6": {
        fontSize: "1rem",
      },
    },
    formType: {
      minWidth: 80,
      margin: "0 15px",
      cursor: "pointer",
      "& div": {
        padding: theme.spacing(1),
      },
    },
    listBox: {
      marginTop: 30,
    },
    listName: {
      "& > *": {
        borderBottom: "unset",
      },
      borderLeft: `3px solid ${indigo[500]}`,
      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.complex,
      }),
    },
  })
);
