import React, { useState, useEffect, FC } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
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

import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

const L_GET_SET = gql`
  query GET_SET($id: Float!) {
    getSet(id: $id) @client {
      id
      name
      items
    }
  }
`;

interface Props {
  id: number;
  name?: string;
  items?: Array<any>;
}

export const ApparatusSet: FC<Props> = ({ id, name, items }) => {
  const classes = useStyles();
  const [show, setShow] = useState<boolean>(true);
  const [children, setChild] = useState<Array<any>>([]);
  const { takeIdForItem, updateName } = useSet();

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        <ApparatusItem set_id={id} id={takeIdForItem()} hideSet={setShow} />,
      ];
    } else {
      newChildren = [
        <ApparatusItem set_id={id} id={takeIdForItem()} hideSet={setShow} />,
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

  useEffect(() => {
    if (items !== undefined) {
      let old_items: any[] = [];
      for (const item of items) {
        console.log(item);
        old_items = [
          ...old_items,
          <ApparatusItem {...item} set_id={id} hideSet={setShow} />,
        ];
      }
      setChild(old_items);
    } else {
      callSetChild(null);
    }
  }, []);

  const is_set = () => data?.getSet.items.length > 1;
  if (!show) return <></>;
  else
    return (
      <Box className={is_set() ? classes.set : classes.item}>
        {JSON.stringify(data?.getSet)}
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
        {children.map((child) => child)}
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
