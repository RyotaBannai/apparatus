import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Grid, Icon } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusLine } from "./ApparatusLine";
import cyan from "@material-ui/core/colors/cyan";
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
  })
);

const L_GET_ITEM_OF_SET = gql`
  Query Items_Of_Set($id: Float!){
    items_of_set(id: $id) @client {
      id
      items
    }
  }
`;

const L_ADD_ITEM_TO_SET = gql`
  mutation AddItemToSet(
    $setId: Float!
    $id: Float!
    $type: String
    $data: String
    $update_data: String!
  ) {
    addItemToSet(
      setId: $setId
      id: $id
      type: $type
      data: $data
      update_data: $update_data
    ) @client
  }
`;

class Counter {
  constructor(private _uuid: number = 0) {}
  get uuid() {
    return this._uuid;
  }
  set uuid(num) {
    this._uuid = this._uuid + num;
  }
}
const counter = new Counter();
const takeId = () => {
  counter.uuid = 1;
  return counter.uuid;
};

interface Props {
  id: number;
  items?: Array<any>;
}

export const ApparatusSet: React.FC<Props> = () => {
  const classes = useStyles();
  let default_form: any[] = [
    {
      id: takeId(),
      item: <ApparatusLine id={counter.uuid} L_ADD_ITEM={L_ADD_ITEM_TO_SET} />,
    },
  ];
  const [children, setChild] = useState<Array<any>>([]);

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        {
          id: takeId(),
          item: (
            <ApparatusLine id={counter.uuid} L_ADD_ITEM={L_ADD_ITEM_TO_SET} />
          ),
        },
      ];
    } else {
      newChildren = [
        {
          id: takeId(),
          item: (
            <ApparatusLine id={counter.uuid} L_ADD_ITEM={L_ADD_ITEM_TO_SET} />
          ),
        },
      ];
    }
    setChild(newChildren);
  };
  //   const { data } = useQuery(L_GET_ITEM_OF_SET);

  //   useEffect(() => {
  //     if (data.items.length > 0) {
  //       let newChildren: any[] = [];
  //       from(data.items)
  //         .pipe(
  //           map((item) => {
  //             _.unset(item, "__typename");
  //             return item;
  //           })
  //         )
  //         .subscribe({
  //           next(item) {
  //             if (item instanceof Object && "id" in item) {
  //               newChildren = [
  //                 ...newChildren,
  //                 {
  //                   id: item["id"],
  //                   item: (
  //                     <ApparatusLine {...item} L_ADD_ITEM={L_ADD_ITEM_TO_SET} />
  //                   ),
  //                 },
  //               ];
  //             }
  //           },
  //           error(err) {
  //             console.log(`Rxjs at Item Add component. ${err}`);
  //           },
  //           complete() {
  //             setChild(newChildren);
  //           },
  //         });
  //     } else {
  //       setChild(default_form);
  //     }
  //   }, []);

  return (
    <div>
      <h2>Set</h2>
      {/* {JSON.stringify(data)} */}
      {children.map((child) => child.item)}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
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
            Add Item
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
