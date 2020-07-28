import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      margin: `${theme.spacing(2)}px 0px`,
    },
    formType: {
      minWidth: 80,
      "& div": {
        padding: theme.spacing(1),
      },
    },
    formData: {
      minWidth: 260,
      "& input": {
        padding: theme.spacing(1),
      },
    },
    description: {
      minWidth: 350,
      "& textarea": {
        minHeight: 100,
      },
    },
    note: {
      minWidth: 350,
      "& textarea": {
        minHeight: 50,
      },
    },
    deleteForm: {
      cursor: "pointer",
      color: blueGrey[800],
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
  })
);
