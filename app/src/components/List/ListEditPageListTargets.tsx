import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { Box, Divider, Typography } from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import ListEditListItem from "./ListEditListItem";
import ListEditListSet from "./ListEditListSet";

interface Props {
  targets: Addee.Addees;
  getHoverStateByIdHandler: (id: string) => any;
  changeHoverState: ({ id, is_hover }: ApparatusList.ListHoverState) => any;
  callSnackBarOpenHandler: () => void;
}

const ListEditPageListTargets: FC<Props> = (props) => {
  const {
    targets,
    getHoverStateByIdHandler,
    changeHoverState,
    callSnackBarOpenHandler,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    console.log(targets);
  }, [targets]);

  return (
    <Box className={classes.listBox}>
      <Typography
        variant="h5"
        color="textPrimary"
        component="p"
        style={{ marginLeft: 10 }}
      >
        Contents
      </Typography>
      <Divider style={{ marginBottom: 10 }} />
      {targets?.map((target: Addee.Addee) => {
        if (target.__typename === "Item") {
          return (
            <ListEditListItem
              item={target}
              getHoverStateByIdHandler={getHoverStateByIdHandler}
              changeHoverState={changeHoverState}
              callSnackBarOpenHandler={callSnackBarOpenHandler}
            />
          );
        } else if (target.__typename === "Set") {
          return (
            <ListEditListSet
              set={target}
              getHoverStateByIdHandler={getHoverStateByIdHandler}
              changeHoverState={changeHoverState}
              callSnackBarOpenHandler={callSnackBarOpenHandler}
            />
          );
        }
      })}
    </Box>
  );
};

export { ListEditPageListTargets as default };