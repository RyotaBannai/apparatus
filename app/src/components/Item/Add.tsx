import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Button, Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusLine } from "./ApparatusLine";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
);

interface Props {}

const G_ADD_ITEM = gql`
  mutation ADD_ITEM($data: String!, $type: String!) {
    createItem(data: { data: $data, type: $type }) {
      id
      data
      type
    }
  }
`;

class Counter {
  constructor(private _uuid: number = 0) {}
  get uuid() {
    return this._uuid++;
  }
}
const counter = new Counter();

export const Add: React.FC<Props> = () => {
  const classes = useStyles();

  const [add, { loading, error, data, called }] = useMutation(G_ADD_ITEM);
  let id = counter.uuid;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Add New Item</h2>
      <ApparatusLine key={id} id={id} />
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              // console.log(_data.value);
              // add({ variables: { data: _data.value, type: type.value } });
              // _data.value = "";
              // type.value = "";
            }}
          >
            Add Item
          </Button>
          {called ? <Grid item>"Item is stored!"</Grid> : ""}
        </Grid>
      </Grid>
    </div>
  );
};
