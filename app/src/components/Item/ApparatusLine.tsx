import React, { useState } from "react";
import {
  InputLabel,
  OutlinedInput,
  Grid,
  Select,
  MenuItem,
  Icon,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

const L_DELETE_ITEM = gql`
  mutation DeleteItem($id: Float!) {
    deleteItem(id: $id) @client {
      id
    }
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
    deleteForm: {
      cursor: "pointer",
      color: blueGrey[800],
    },
  })
);

interface Props {
  id: number;
  L_ADD_ITEM: import("graphql").DocumentNode;
  type?: string;
  data?: string;
}

export const ApparatusLine: React.FC<Props> = ({ id, type, data, L_ADD_ITEM }) => {
  const classes = useStyles();
  const [l_addItem] = useMutation(L_ADD_ITEM);
  const [show, setShow] = useState<boolean>(true);
  const [
    l_deleteItem,
    { loading: ld_loading, error: ld_error, called: ld_called },
  ] = useMutation(L_DELETE_ITEM);

  if (!show) return <></>;
  else
    return (
      <Grid container alignItems="flex-end" direction="row" spacing={1}>
        <Grid item>
          <InputLabel htmlFor="type">Type</InputLabel>
          <Select
            id="type"
            required
            className={classes.formType}
            variant="outlined"
            autoWidth
            defaultValue={type ?? 'line'}
            onChange={(e: any) => {
              e.preventDefault();
              let variables: any = {
                id,
                type: e.target.value,
                update_data: "type",
              };
              l_addItem({
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
            defaultValue={data ?? ''}
            onChange={(e: any) => {
              e.preventDefault();
              let variables: any = {
                id,
                data: e.target.value,
                update_data: "data",
              };
              l_addItem({
                variables,
              });
            }}
          />
        </Grid>
        <Grid item>
          <Icon
            className={classes.deleteForm}
            onClick={(e: any) => {
              e.preventDefault();
              setShow(!show);
              let variables: { id: number } = {
                id,
              };
              l_deleteItem({
                variables,
              });
            }}
          >
            delete_forever
          </Icon>
        </Grid>
      </Grid>
    );
};
