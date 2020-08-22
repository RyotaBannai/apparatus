import React, { useState, useCallback, SyntheticEvent, FC } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { S_CREATE_WORKSPACE } from "../../api/graphql/workspaceQueries";
import { useStyles } from "../../assets/style/workspace/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useWSActions } from "../../features/workspace/wsFeatureSlice";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { SaveButton } from "../../components/Parts/Button/SaveButton";
import { Grid, InputLabel, OutlinedInput, TextField } from "@material-ui/core";

interface Props {}
const CreatePage: FC<Props> = () => {
  const dispatch = useDispatch();
  const { addateWS } = useWSActions();
  const { getWorkspace } = useWSHelpers;
  const data = useSelector(getWorkspace);
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);

  const onChangeName = (e: any) => handleEvent(e, "name");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(e.target.value, form_name);
  };
  const setChange = (value: string, update_data: string) => {
    dispatch(
      addateWS({
        [update_data]: value,
        type: update_data,
      })
    );
  };

  const [
    s_createWorkspace,
    { loading: sa_loading, error: sa_error },
  ] = useMutation(S_CREATE_WORKSPACE, {
    onCompleted({ res }) {
      setOpen(!saveSnackBarOpen);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  let handleOnClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      s_createWorkspace({
        variables: data,
      });
    },
    [data, s_createWorkspace]
  );

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Create New Workspace</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
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
          <SaveButton name="Create Workspace" handleOnClick={handleOnClick} />
        </Grid>
      </Grid>
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { CreatePage as default };
