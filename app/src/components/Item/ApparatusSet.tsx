import React, { useState, useEffect, FC } from "react";
import { useSet } from "../../modules/set/actions";
import {
  Button,
  Box,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@material-ui/core";
import { ApparatusItem } from "./ApparatusItem";
import { useStyles } from "../../assets/style/item/set.style";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import * as _ from "lodash";

interface Props {
  id: number;
  set_id_on_server?: number | undefined;
  name?: string;
  items?: Array<any>;
  edit_mode?: boolean;
}

export const ApparatusSet: FC<Props> = ({
  id,
  set_id_on_server,
  name,
  items,
  edit_mode,
}) => {
  const classes = useStyles();
  const [show, setShow] = useState<boolean>(true);
  const [children, setChild] = useState<Array<any>>([]);
  const { createSet, updateSetStatus } = useSet();
  const { createSet: createSetAction, updateName } = useSetActions();
  const { getNewSets, getSetById, isSet, takeIdForItem } = useSetHelpers;
  const dispatch = useDispatch();
  const data = getSetById(useSelector(getNewSets), id);
  const is_set = isSet(data);

  const callAddChild = (_children: Array<any> | null) => {
    let newChildren;
    let item_id = takeIdForItem();
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        <ApparatusItem
          key={item_id}
          set_id={id}
          id={item_id}
          hideSet={setShow}
        />,
      ];
    } else {
      newChildren = [
        <ApparatusItem
          key={item_id}
          set_id={id}
          id={item_id}
          hideSet={setShow}
        />,
      ];
    }
    setChild(newChildren);
  };

  const updateSetName = (e: any) => {
    e.preventDefault();
    dispatch(updateName({ id, name: e.target.value }));
  };

  useEffect(() => {
    if (edit_mode) {
      if (edit_mode && items !== undefined) {
        let items_edit: any[] = [];
        for (const item of items) {
          items_edit = [
            ...items_edit,
            {
              ...item,
              id: takeIdForItem(),
              id_on_server: item.id,
            },
          ];
        }
        createSet({
          id,
          name,
          set_id_on_server,
          items: items_edit,
        });
        dispatch(
          createSetAction({
            id,
            name,
            set_id_on_server,
            items: items_edit,
          })
        );

        let old_items: any[] = [];
        for (const item_edit of items_edit) {
          old_items = [
            ...old_items,
            <ApparatusItem {...item_edit} set_id={id} hideSet={setShow} />,
          ];
        }
        setChild(old_items);
      }
    } else {
      if (items !== undefined) {
        createSet({
          id,
          name,
          items,
        });
        dispatch(
          createSetAction({
            id,
            name,
            items,
          })
        );
        let old_items: any[] = [];
        for (const item of items) {
          old_items = [
            ...old_items,
            <ApparatusItem {...item} set_id={id} hideSet={setShow} />,
          ];
        }
        setChild(old_items);
      } else {
        createSet({
          id,
        });
        dispatch(
          createSetAction({
            id,
          })
        );
        callAddChild(null);
      }
    }
  }, []);

  if (!show) return <></>;
  else
    return (
      <Box className={is_set ? classes.set : classes.item}>
        <pre>{JSON.stringify(data, null, 1)}</pre>
        {is_set ? (
          <Grid container alignItems="flex-end" direction="row" spacing={1}>
            <Grid item>
              <InputLabel htmlFor="data">Set Name</InputLabel>
              <OutlinedInput
                id="data"
                required
                className={classes.formData}
                defaultValue={name ?? "Set"}
                onChange={updateSetName}
              />
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
        <div className={classes.itemBox}>{children.map((child) => child)}</div>
        <Grid container alignItems="center" direction="row" spacing={1}>
          {is_set ? (
            <Grid item className={classes.addItemHugeButton}>
              <Button
                variant="contained"
                className={classes.addButton}
                startIcon={<Icon>add_circle</Icon>}
                disableRipple
                disableTouchRipple
                onClick={(e) => {
                  e.preventDefault();
                  callAddChild(children);
                }}
              >
                Add Item To Set
              </Button>
            </Grid>
          ) : (
            <Grid item>
              <Tooltip title="To Set" placement="top">
                <Icon
                  className={classes.toSet}
                  onClick={(e) => {
                    e.preventDefault();
                    callAddChild(children);
                  }}
                >
                  add_box
                </Icon>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Box>
    );
};
