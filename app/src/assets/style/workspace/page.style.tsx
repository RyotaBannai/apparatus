import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    gridName: {
      width: "100%",
    },
    gridDescription: {
      width: "100%",
    },
  })
);
