import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listParent: {
      backgroundColor: grey[200],
      "&:hover": {
        backgroundColor: grey[300],
      },
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);
