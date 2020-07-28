import React, { useState, useEffect } from "react";
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
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusItem } from "./ApparatusItem";
import cyan from "@material-ui/core/colors/cyan";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";
import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      color: "#fff",
      backgroundColor: cyan[700],
      "&:hover": {
        backgroundColor: cyan[800],
      },
      "&:focus": {
        outlineColor: cyan[800],
      },
    },
    toSet: {
      cursor: "pointer",
      color: cyan[700],
      "&:hover": {
        color: cyan[800],
      },
      "&:focus": {
        color: cyan[800],
      },
    },
    set: {
      backgroundColor: indigo[50],
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      borderRadius: 5,
      border: `2px solid ${indigo[100]}`,
    },
    item: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      borderRadius: 5,
      border: `2px solid ${grey[200]}`,
    },
    addItemHugeButton: {
      paddingTop: `${theme.spacing(3)}px !important`,
    },
    formData: {
      minWidth: 120,
      "& input": {
        padding: theme.spacing(1),
      },
    },
  })
);

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

export const ApparatusSet: React.FC<Props> = ({ id, name, items }) => {
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
