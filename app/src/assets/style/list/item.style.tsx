import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
