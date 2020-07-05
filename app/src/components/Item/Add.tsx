import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Button, InputLabel, OutlinedInput, Grid } from "@material-ui/core";

interface Props {
  title: string;
}

const ADD_ITEM = gql`
  mutation ADD_ITEM($data: String!, $type: String!) {
    createItem(data: { data: $data, type: $type }) {
      id
      data
      type
    }
  }
`;

export const Add: React.FC<Props> = ({ title }) => {
  let _data: any = "";
  let type: any = "";

  const [add, { loading, error, data, called }] = useMutation(ADD_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <div>
        <h2>Add New Item</h2>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
          <Grid item>
            <InputLabel htmlFor="data">Data</InputLabel>
            <OutlinedInput
              id="data"
              required
              inputRef={(node) => {
                _data = node;
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="type">Type</InputLabel>
            <OutlinedInput
              id="type"
              required
              inputRef={(node) => {
                type = node;
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                console.log(_data.value);
                add({ variables: { data: _data.value, type: type.value } });
                _data.value = "";
                type.value = "";
              }}
            >
              Add Item
            </Button>
            {called ? <Grid item>"Item is stored!"</Grid> : ""}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
