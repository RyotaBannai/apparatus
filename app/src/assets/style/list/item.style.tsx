import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import red from "@material-ui/core/colors/red";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "5px 0",
      "& .MuiCardContent-root": {
        paddingBottom: 16,
      },
      "& > *": {
        borderBottom: "unset",
      },
      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.complex,
      }),
    },
  })
);
