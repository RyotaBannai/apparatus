import React, { useState, useEffect, FC } from "react";
import { useStyles } from "../../assets/style/list/item.style";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import { ListEditTargetButton } from "../Parts/Button/ListEditTargetButton";

type TProps = {
  item: Item.Item;
  is_set: boolean;
} & IMethod;

interface IMethod {
  getHoverStateByIdHandler: (id: string) => any;
  changeHoverState: ({ id, is_hover }: ApparatusList.ListHoverState) => any;
  callSnackBarOpenHandler: () => void;
}

const ListEditListItem: FC<TProps> = (props) => {
  const { item } = props;
  useEffect(() => {}, [props]);
  return (
    <CardHoverable {...props}>
      <CardContent>
        <Typography gutterBottom variant="body1" component="h4">
          {item?.data ?? ""}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {item?.description ?? ""}
        </Typography>
      </CardContent>
    </CardHoverable>
  );
};

type THoverableProps = TProps & {
  children: React.ReactElement<any, any>;
};

const CardHoverable: FC<THoverableProps> = (props) => {
  const {
    is_set,
    item,
    getHoverStateByIdHandler,
    changeHoverState,
    callSnackBarOpenHandler,
    children,
  } = props;
  const hover_state_prefix = "Item-";
  const item_id = hover_state_prefix + item?.id;
  const classes = useStyles();

  useEffect(() => {}, [props]);

  if (is_set === true) {
    return <Card className={classes.root}>{children}</Card>;
  } else {
    return (
      <Card
        className={classes.root}
        onMouseEnter={() =>
          changeHoverState({
            id: item_id,
            is_hover: true,
          })
        }
        onMouseLeave={() =>
          changeHoverState({
            id: item_id,
            is_hover: false,
          })
        }
      >
        {children}
        {getHoverStateByIdHandler(item_id)?.is_hover ? (
          <CardActions>
            <ListEditTargetButton
              name="Edit"
              handleOnClick={() => {
                //TODO: link to edit page}
              }}
            />
          </CardActions>
        ) : (
          <></>
        )}
      </Card>
    );
  }
};

export { ListEditListItem as default };
