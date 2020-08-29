import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import red from "@material-ui/core/colors/red";

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
