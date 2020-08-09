import React, { useState, useEffect, FC } from "react";
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
import { v4 as uuidv4 } from "uuid";

interface Props {
  id: number;
  mode: Global.Mode;
  set_id_on_server?: number | undefined | null;
  name?: string;
  items?: Array<any>;
}

export const ApparatusSet: FC<Props> = ({
  id,
  set_id_on_server,
  name,
  items,
  mode,
}) => {
  const classes = useStyles();
  const [children, setChild] = useState<Array<any>>([]);
  const { createSet, updateName } = useSetActions();
  const {
    getNewSets,
    getEditSets,
    getSetByKey,
    isSet,
    takeIdForItem,
  } = useSetHelpers;
  const dispatch = useDispatch();
  const data = getSetByKey(
    useSelector(mode === "new" ? getNewSets : getEditSets),
    { keyname: "id", key: id }
  );
  const is_set = isSet(data);
  const show = data?.show;

  const callAddChild = (_children: Array<any> | null) => {
    let newChildren;
    let item_id = takeIdForItem();
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        <ApparatusItem set_id={id} id={item_id} key={uuidv4()} mode={mode} />,
      ];
    } else {
      newChildren = [
        <ApparatusItem set_id={id} id={item_id} key={uuidv4()} mode={mode} />,
      ];
    }
    setChild(newChildren);
  };

  const updateSetName = (e: any) => {
    e.preventDefault();
    dispatch(updateName({ id, name: e.target.value, mode }));
  };

  const dispatchCreateSet = (
    payload: Partial<ApparatusSet.Set> & {
      id: number;
      mode: Global.Mode;
    }
  ) => {
    dispatch(createSet(payload));
  };

  useEffect(() => {
    if (mode === "edit") {
      if (items === undefined) return;
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

      dispatchCreateSet({
        id,
        name,
        set_id_on_server,
        items: items_edit,
        mode,
      });

      let old_items: any[] = [];
      for (const item_edit of items_edit) {
        old_items = [
          ...old_items,
          <ApparatusItem
            {...item_edit}
            set_id={id}
            key={uuidv4()}
            mode={"edit"}
          />,
        ];
      }

      setChild(old_items);
    } else {
      if (items !== undefined) {
        dispatchCreateSet({
          id,
          name,
          items,
          mode,
        });

        let old_items: any[] = [];

        for (const item of items) {
          old_items = [
            ...old_items,
            <ApparatusItem {...item} set_id={id} key={uuidv4()} mode={"new"} />,
          ];
        }
        setChild(old_items);
      } else {
        dispatchCreateSet({
          id,
          mode,
        });

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
