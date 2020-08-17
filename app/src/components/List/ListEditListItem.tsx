import React, { useState, useEffect, FC } from "react";
import { useStyles } from "../../assets/style/list/item.style";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";

interface Props {
  item: Item.Item;
  getHoverStateByIdHandler: (id: string) => any;
  changeHoverState: ({ id, is_hover }: ApparatusList.ListHoverState) => any;
  callSnackBarOpenHandler: () => void;
}

const ListEditListItem: FC<Props> = (props) => {
  const {
    item,
    getHoverStateByIdHandler,
    changeHoverState,
    callSnackBarOpenHandler,
  } = props;
  const classes = useStyles();
  const [editItem, setEditItem] = useState(false);

  useEffect(() => {
    console.log(item);
  }, [item]);
  return (
    <>
      <Card
        className={classes.root}
        onMouseEnter={() =>
          changeHoverState({
            id: "list_title",
            is_hover: true,
          })
        }
        onMouseLeave={() =>
          changeHoverState({
            id: "list_title",
            is_hover: false,
          })
        }
      >
        <CardContent>
          <Typography gutterBottom variant="body1" component="h4">
            {item?.data ?? ""}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {item?.description ?? ""}
          </Typography>
        </CardContent>
        {getHoverStateByIdHandler(String(item?.id))?.is_hover ? (
          <CardActions>
            <Button
              size="small"
              color="primary"
              disableRipple
              disableTouchRipple
              onClick={() => {
                setEditItem(!editItem);
                changeHoverState({
                  id: "list_title",
                  is_hover: false,
                });
              }}
            >
              Edit
            </Button>
          </CardActions>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
};

export { ListEditListItem as default };
