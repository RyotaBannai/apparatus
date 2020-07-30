import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  L_GET_WORKSPACE,
  S_CREATE_WORKSPACE,
} from "../../modules/workspace/queries";
import { useWorkspace } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/workspace/page.style";
import {
  Button,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";

interface Props {}
export const CreatePage: FC<Props> = () => {
  const { addateWS } = useWorkspace();
  const classes = useStyles();

  const onChangeName = (e: any) => handleEvent(e, "name");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(e.target.value, form_name);
  };
  const setChange = (value: string, update_data: string) => {
    addateWS({
      [update_data]: value,
      type: update_data,
    });
  };

  const { data } = useQuery(L_GET_WORKSPACE);

  const [
    s_createWorkspace,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_CREATE_WORKSPACE, {
    onCompleted({ res }) {
      console.log("workspace was successfully created!");
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Create New Workspace</h2>
      <pre>{JSON.stringify(data, null, 1)}</pre>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridName}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            required
            defaultValue={"Workspace"}
            className={classes.name}
            onChange={onChangeName}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridDescription}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <TextField
            id="description"
            required
            multiline
            rowsMax={4}
            variant="outlined"
            defaultValue={"Describe this workspace. (ex: Chinese course)"}
            className={classes.description}
            onChange={onChangeDescription}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            endIcon={<Icon>arrow_right</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              s_createWorkspace({
                variables: data.getWorkspace,
              });
            }}
          >
            Create Workspace
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
