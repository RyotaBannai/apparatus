import React, { useCallback, RefObject, FC } from "react";
import { useHistory } from "react-router-dom";
import { Box, Checkbox, Grid, Typography } from "@material-ui/core";
import { useStyles } from "../../assets/style/list/set.style";
import ListEditListItem from "./ListEditListItem";

interface Props {
  is_note_mode: boolean;
  selectable: ApparatusList.Selectable;
  set: ApparatusSet.Set;
  callSnackBarOpenHandler: () => void;
  onMouseUpHandler: ({
    itemId,
    rootRef,
  }: {
    itemId: string;
    rootRef: RefObject<unknown>;
  }) => () => void;
}

const ListEditPageListTargets: FC<Props> = (props) => {
  const {
    is_note_mode,
    selectable,
    set,
    callSnackBarOpenHandler,
    onMouseUpHandler,
  } = props;
  const { is_selectable, add, remove, selected } = selectable;
  const classes = useStyles();
  const history = useHistory();
  let is_selected = selected?.sets.includes(set?.id);

  const goToSet = useCallback(() => history.push(`/set_edit/${set.id}`), [set]);

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const id = e.target.value;
    const add_to = "sets" as "sets";
    if (is_checked === true && add !== undefined) {
      add({ id, add_to });
    } else if (is_checked === false && remove !== undefined) {
      remove({ id, add_to });
    }
  }, []);

  const onDoNothing = () => {};

  return (
    <Box className={classes.root}>
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
              value={set.id}
            />
          </Grid>
        ) : (
          <></>
        )}
        <Grid
          item
          xs={is_selectable ? 11 : 12}
          onClick={is_note_mode ? onDoNothing : goToSet}
          style={{ cursor: "pointer" }}
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
                selectable={{ is_selectable: false }}
                item={item}
                is_set={true}
                is_note_mode={is_note_mode}
                callSnackBarOpenHandler={callSnackBarOpenHandler}
                onMouseUpHandler={onMouseUpHandler}
              />
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};

export { ListEditPageListTargets as default };
