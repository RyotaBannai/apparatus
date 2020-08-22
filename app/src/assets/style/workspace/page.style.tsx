import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
    currentWS: {
      backgroundColor: indigo[50],
      transition: theme.transitions.create(["background-color", "color"], {
        duration: theme.transitions.duration.complex,
      }),
      "&:hover": {
        backgroundColor: `${indigo[100]} !important`,
      },
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
    gridName: {
      width: "100%",
    },
    gridDescription: {
      width: "100%",
    },
  })
);
