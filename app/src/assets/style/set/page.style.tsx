import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
    itemListTop: {
      justifyContent: "space-between",
    },
    itemTable: {
      padding: 10,
      "& div": {
        backgroundColor: "#eeeeee",
      },
    },
  })
);
