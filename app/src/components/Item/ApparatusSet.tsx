import React, { useState, useEffect, FC } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useSet } from "../../modules/set/actions";
import { L_GET_SET } from "../../modules/item/queries";
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

import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

interface Props {
  id: number;
  set_id_on_server?: number | undefined;
  name?: string;
  items?: Array<any>;
  edit_mode?: boolean;
}

export const ApparatusSet: FC<Props> = ({ id, set_id_on_server, name, items, edit_mode }) => {
  const classes = useStyles();
  const [show, setShow] = useState<boolean>(true);
  const [children, setChild] = useState<Array<any>>([]);
  const { addateItem, takeIdForItem, updateName, updateSetStatus } = useSet();

  const callSetChild = (_children: Array<any> | null) => {
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
    updateName(id, e.target.value);
  };

  const { data } = useQuery(L_GET_SET, {
    variables: {
      id,
    },
  });
  const is_set = () => data?.getSet.items.length > 1;
  updateSetStatus(id, is_set());

  useEffect(() => {
    if (items !== undefined) {
      let old_items: any[] = [];
      for (const item of items) {
        if(edit_mode){
          let fetched_item = {
            ...item,
            id: takeIdForItem(),
            id_on_server: item.id,
          };
          addateItem({
            id,
            name,
            set_id_on_server,
            item:fetched_item
          });
          old_items = [...old_items, <ApparatusItem {...fetched_item} set_id={id} hideSet={setShow} />];
        } else{
          old_items = [
            ...old_items,
            <ApparatusItem {...item} set_id={id} hideSet={setShow} />,
          ];
        }
      }
      setChild(old_items);
    } else {
      callSetChild(null);
    }
  }, []);

  if (!show) return <></>;
  else
    return (
      <Box className={is_set() ? classes.set : classes.item}>
        {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
        {is_set() ? (
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
          {is_set() ? (
            <Grid item className={classes.addItemHugeButton}>
              <Button
                variant="contained"
                className={classes.addButton}
                startIcon={<Icon>add_circle</Icon>}
                disableRipple
                disableTouchRipple
                onClick={(e) => {
                  e.preventDefault();
                  callSetChild(children);
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
                    callSetChild(children);
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
