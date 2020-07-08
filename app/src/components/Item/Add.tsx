import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import {
  Button,
  InputLabel,
  OutlinedInput,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formType: {
      minWidth: 80,
      "& div": {
        padding: theme.spacing(1),
      },
    },
    formData: {
      minWidth: 120,
      "& input": {
        padding: theme.spacing(1),
      },
    },
  })
);

interface Props {}

const ADD_ITEM = gql`
  mutation ADD_ITEM($data: String!, $type: String!) {
    createItem(data: { data: $data, type: $type }) {
      id
      data
      type
    }
  }
`;

export const Add: React.FC<Props> = () => {
  const classes = useStyles();

  let _data: any = "";
  let type: any = "";

  const [add, { loading, error, data, called }] = useMutation(ADD_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Add New Item</h2>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <InputLabel htmlFor="type">Type</InputLabel>
          <Select
            id="type"
            required
            className={classes.formType}
            variant="outlined"
            autoWidth
            inputRef={(node) => {
              type = node;
            }}
            defaultValue="line"
          >
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="field">Field</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <InputLabel htmlFor="data">Data</InputLabel>
          <OutlinedInput
            id="data"
            required
            className={classes.formData}
            inputRef={(node) => {
              _data = node;
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
  );
};
