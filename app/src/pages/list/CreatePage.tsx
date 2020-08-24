import React, { useState, useCallback, SyntheticEvent, FC } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { S_CREATE_LIST } from "../../api/graphql/listQueries";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SaveButton } from "../../components/Parts/Button/SaveButton";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { Grid, InputLabel, OutlinedInput, TextField } from "@material-ui/core";

interface Props {}
const CreatePage: FC<Props> = () => {
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  const { getNewList } = useListHelpers;
  const data = useSelector(getNewList);
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const { getCurrentWS } = useWSHelpers;

  const onChangeName = (e: any) => handleEvent(e, "name");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(e.target.value, form_name);
  };

  const setChange = (value: string, update_data: string) => {
    dispatch(
      addateList({
        [update_data]: value,
        mode: "new",
      })
    );
  };

  const [s_createList, { loading: sa_loading, error: sa_error }] = useMutation(
    S_CREATE_LIST,
    {
      onCompleted({ createList }) {
        setOpen(!saveSnackBarOpen);
      },
      onError(error: ApolloError) {
        console.log(error);
      },
    }
  );

  const handleOnClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      s_createList({
        variables: { ...data, wsId: Number(getCurrentWS().id) },
      });
    },
    [data]
  );

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Create New List</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridName}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            required
            defaultValue={data?.name ?? "List"}
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
            defaultValue={data?.description ?? ""}
            className={classes.description}
            onChange={onChangeDescription}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <SaveButton name="Create List" handleOnClick={handleOnClick} />
        </Grid>
      </Grid>
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { CreatePage as default };
