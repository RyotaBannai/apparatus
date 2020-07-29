import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      color: "#fff",
      backgroundColor: cyan[700],
      "&:hover": {
        backgroundColor: cyan[800],
      },
      "&:focus": {
        outlineColor: cyan[800],
      },
    },
    toSet: {
      cursor: "pointer",
      color: cyan[700],
      "&:hover": {
        color: cyan[800],
      },
      "&:focus": {
        color: cyan[800],
      },
    },
    set: {
      backgroundColor: indigo[50],
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      borderRadius: 5,
      border: `2px solid ${indigo[100]}`,
    },
    item: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      borderRadius: 5,
      border: `2px solid ${grey[200]}`,
    },
    itemBox: {
      display: "grid",
      "grid-template-columns": " repeat(2, 1fr)",
      "grid-column-gap": 10,
      "grid-row-gap": 10,
    },
    addItemHugeButton: {
      paddingTop: `${theme.spacing(3)}px !important`,
    },
    formData: {
      minWidth: 120,
      "& input": {
        padding: theme.spacing(1),
      },
    },
  })
);
