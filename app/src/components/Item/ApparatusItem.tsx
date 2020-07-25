import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSet } from "../../modules/set/actions";
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
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import Tooltip from "@material-ui/core/Tooltip";

const L_DELETE_ITEM = gql`
  mutation DeleteItem($id: Float!) {
    deleteItem(id: $id) @client {
      id
    }
  }
`;

const L_ADD_ITEM = gql`
  mutation AddItem(
    $id: Float!
    $itemId: Float!
    $type: String
    $data: String
    $update_data: String!
  ) {
    addItem(
      id: $id
      itemId: $itemId
      type: $type
      data: $data
      update_data: $update_data
    ) @client
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
  })
);

interface Props {
  setId: number;
  id: number;
  type?: string;
  data?: string;
  belongToSet?: boolean;
}

export const ApparatusItem: React.FC<Props> = ({
  setId,
  id,
  type,
  data,
  belongToSet = false,
}) => {
  const classes = useStyles();
  const { addItem } = useSet();
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
            defaultValue={type ?? "line"}
            onChange={(e: any) => {
              e.preventDefault();
              let variables: any = {
                id: setId,
                itemId: id,
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
            defaultValue={data ?? ""}
            onChange={(e: any) => {
              e.preventDefault();
              let item: any = {
                id: id,
                data: e.target.value,
                update_data: "data",
              };
              addItem({
                id: setId,
                item,
              });
            }}
          />
        </Grid>
        {(() => {
          if (!belongToSet) {
            return (
              <Grid item>
                <Tooltip title="To Set" placement="top">
                  <Icon
                    className={classes.toSet}
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
                    add_box
                  </Icon>
                </Tooltip>
              </Grid>
            );
          }
        })()}
        <Grid item>
          <Tooltip title="Delete" placement="top">
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
          </Tooltip>
        </Grid>
      </Grid>
    );
};
