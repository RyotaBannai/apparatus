import React, { useState, useEffect, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/list/item.style";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";

type TProps = {
  selectable: ApparatusList.Selectable;
  item: Item.Item;
  is_set: boolean;
  is_note_mode: boolean;
  callSnackBarOpenHandler: () => void;
  onMouseUpHandler: () => void;
};

const ListEditListItem: FC<TProps> = (props) => {
  const { selectable, item, is_note_mode, is_set, onMouseUpHandler } = props;
  const { is_selectable, add, remove, selected } = selectable;
  const classes = useStyles();
  const history = useHistory();
  let is_selected = selected?.items.includes(item?.id);

  const goToItem = useCallback(() => history.push(`/item_edit/${item.id}`), [
    item,
  ]);

  const pressCheckBoxHandler = useCallback(
    (e) => {
      const is_checked = e.target.checked;
      const id = e.target.value;
      const add_to = "items" as "items";
      if (is_checked === true && add !== undefined) {
        add({ id, add_to });
      } else if (is_checked === false && remove !== undefined) {
        remove({ id, add_to });
      }
    },
    [add, remove]
  );

  const onDoNothing = () => {};

  useEffect(() => {}, [props]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="row" spacing={1}>
          {is_selectable ? (
            <Grid item xs={1} style={{ display: "inline-grid" }}>
              <Checkbox
                checked={is_selected}
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                style={{ margin: "auto" }}
                size={"small"}
                onChange={pressCheckBoxHandler}
                value={item.id}
              />
            </Grid>
          ) : (
            <></>
          )}
          <Grid
            item
            xs={is_selectable ? 11 : 12}
            onClick={is_set || is_note_mode ? onDoNothing : goToItem}
            style={{ cursor: "pointer" }}
          >
            <Typography
              gutterBottom
              variant="subtitle1"
              component="h4"
              className={"highlightable"}
              onMouseUp={is_note_mode ? onMouseUpHandler : onDoNothing}
            >
              {item?.data ?? ""}
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
              component="p"
              className={"highlightable"}
              onMouseUp={is_note_mode ? onMouseUpHandler : onDoNothing}
            >
              {item.description}
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginTop: 5 }}
              className={"highlightable"}
              onMouseUp={is_note_mode ? onMouseUpHandler : onDoNothing}
            >
              {item.note ?? ""}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { ListEditListItem as default };
