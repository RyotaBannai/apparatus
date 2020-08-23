import React, { useEffect, useCallback, FC } from "react";
import { Box, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useStyles } from "../../assets/style/list/set.style";
import ListEditListItem from "./ListEditListItem";
import { ListEditTargetButton } from "../Parts/Button/ListEditTargetButton";
import { v4 as uuidv4 } from "uuid";

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
  const hover_state_prefix = "Set-";
  const set_id = hover_state_prefix + set.id;
  const set_link = `/set_edit/${set.id}`;

  useEffect(() => {}, [set]);

  return (
    <Box
      className={classes.root}
      onMouseEnter={() =>
        changeHoverState({
          id: set_id,
          is_hover: true,
        })
      }
      onMouseLeave={() =>
        changeHoverState({
          id: set_id,
          is_hover: false,
        })
      }
    >
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
            key={uuidv4()}
            item={item}
            is_set={true}
            getHoverStateByIdHandler={getHoverStateByIdHandler}
            changeHoverState={changeHoverState}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
          />
        );
      })}
      {getHoverStateByIdHandler(set_id)?.is_hover ? (
        <Box style={{ padding: 6 }}>
          <NavLink exact to={set_link} key={uuidv4()}>
            <ListEditTargetButton name="Edit" />
          </NavLink>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export { ListEditPageListTargets as default };
