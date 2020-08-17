import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { Box, Typography } from "@material-ui/core";
import { useStyles } from "../../assets/style/list/set.style";
import ListEditListItem from "./ListEditListItem";

interface Props {
  set: ApparatusSet.Set;
  getHoverStateByIdHandler: (id: string) => any;
  changeHoverState: ({ id, is_hover }: ApparatusList.ListHoverState) => any;
  callSnackBarOpenHandler: () => void;
}

const ListEditPageListTargets: FC<Props> = (props) => {
  const {
    set,
    getHoverStateByIdHandler,
    changeHoverState,
    callSnackBarOpenHandler,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    console.log(set);
  }, [set]);

  return (
    <Box className={classes.root}>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        component="p"
        style={{ marginLeft: 10 }}
      >
        {set.name}
      </Typography>
      {set?.items.map((item: Item.Item) => {
        return (
          <ListEditListItem
            item={item}
            getHoverStateByIdHandler={getHoverStateByIdHandler}
            changeHoverState={changeHoverState}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
          />
        );
      })}
    </Box>
  );
};

export { ListEditPageListTargets as default };
