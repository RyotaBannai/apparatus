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
    deleteForm: {
      cursor: "pointer",
      color: blueGrey[800],
    },
  })
);

interface Props {
  id: number;
}

export const ApparatusLine: React.FC<Props> = ({ id }) => {
  const classes = useStyles();
  const [addItem] = useMutation(L_ADD_ITEM);
  const [show, setShow] = useState<boolean>(true);

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
        <Grid item>
          <Icon className={classes.deleteForm} onClick={() => setShow(!show)}>
            {/* TODO: remove data from apollo cache */}
            delete_forever
          </Icon>
        </Grid>
      </Grid>
    );
};
