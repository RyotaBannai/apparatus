import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  S_GET_WORKSPACE,
  S_EDIT_WORKSPACE,
} from "../../api/graphql/workspaceQueries";
import { useStyles } from "../../assets/style/workspace/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useWSActions } from "../../features/workspace/wsFeatureSlice";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import {
  Button,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";

interface Props {}
const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { addateWS } = useWSActions();
  const { getWorkspace, getCurrentWS } = useWSHelpers;
  const l_data = useSelector(getWorkspace);

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

  const { loading: sg_loading, error: sg_error, data } = useQuery(
    S_GET_WORKSPACE,
    {
      variables: {
        id: getCurrentWS().id,
      },
    }
  );

  const [
    s_editWorkspace,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_EDIT_WORKSPACE, {
    onCompleted({ res }) {
      setOpen(!saveSnackBarOpen);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Edit Current Workspace</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre>
      <pre>{JSON.stringify(l_data, null, 1)}</pre> */}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridName}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            required
            defaultValue={data?.getWorkspace.name ?? "Workspace"}
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
            defaultValue={
              data?.getWorkspace.description ?? "Describe your workspace"
            }
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
              s_editWorkspace({
                variables: { ...l_data, id: getCurrentWS().id },
              });
            }}
          >
            Edit Workspace
          </Button>
        </Grid>
      </Grid>
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
