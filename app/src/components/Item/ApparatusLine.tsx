import React from "react";
import {
  InputLabel,
  OutlinedInput,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

const L_GET_ITEM = gql`
  {
    items @client {
      type
      data
    }
  }
`;

const L_ADD_ITEM = gql`
  mutation AddItem(
    $id: Float!
    $type: String
    $data: String
    $update_data: String!
  ) {
    addItem(id: $id, type: $type, data: $data, update_data: $update_data)
      @client
  }
`;

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

interface Props {
  id: number;
}

export const ApparatusLine: React.FC<Props> = ({ id }) => {
  const classes = useStyles();

  const { data } = useQuery(L_GET_ITEM);
  const [addItem] = useMutation(L_ADD_ITEM);

  return (
    <Grid container alignItems="center" direction="row" spacing={1}>
      {JSON.stringify(data)}
      <Grid item>
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select
          id="type"
          required
          className={classes.formType}
          variant="outlined"
          autoWidth
          defaultValue="line"
          onChange={(e: any) => {
            e.preventDefault();
            let variables: any = {
              id,
              type: e.target.value,
              update_data: "type",
            };
            addItem({
              variables,
            });
          }}
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
          onChange={(e: any) => {
            e.preventDefault();
            let variables: any = {
              id,
              data: e.target.value,
              update_data: "data",
            };
            addItem({
              variables,
            });
          }}
        />
      </Grid>
    </Grid>
  );
};
