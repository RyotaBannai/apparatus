import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import red from "@material-ui/core/colors/red";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "10px 0 0 0",
      border: "2px solid #eeeeee",
      borderRadius: 5,
      backgroundColor: "#f5f5f5",
      "& .MuiCardContent-root": {
        paddingBottom: 16,
      },
      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.complex,
      }),
    },
  })
);
