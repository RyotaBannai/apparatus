import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";

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
    alertDeleteSetOnEdit: {
      marginBottom: 10,
    },
  })
);
