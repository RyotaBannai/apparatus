import React, { useState, useEffect, useRef, SyntheticEvent, FC } from "react";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_LIST } from "../../api/graphql/listQueries";
import { useParams } from "react-router-dom";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@material-ui/core";

interface Props {}
const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const [editSetData, setEditSetData] = useState(false);
  const inputName = useRef(null);
  const inputDescription = useRef(null);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  let { list_id } = useParams<{ list_id?: string }>();
  const { getEditLists, getListByKey, takeIdForList } = useListHelpers;
  const this_list = getListByKey(useSelector(getEditLists), {
    key_name: "id_on_server",
    key: list_id,
  });

  const setChange = (newListData: ApparatusList.UpdateSetInput[]) => {
    let payload = Object.assign(
      {
        id: Number(this_list?.id),
        mode: "edit",
      },
      ...newListData.map((keyValue: ApparatusList.UpdateSetInput) => ({
        [keyValue.key]: keyValue.value,
      }))
    );
    dispatch(addateList(payload));
  };

  const [
    fetchList,
    { loading: sg_loading, error: sg_error, data, refetch },
  ] = useLazyQuery(S_GET_LIST, {
    variables: {
      id: String(list_id),
    },
    onCompleted({ getList }) {
      const { id, description, name, targets } = getList;
      dispatch(
        addateList({
          id: takeIdForList(),
          id_on_server: id,
          description,
          name,
          targets,
          mode: "edit",
        })
      );
    },
  });

  const getValueFromHTMLElement = (
    ref: React.MutableRefObject<string | null>,
    tag_type: "input" | "textarea"
  ) => ((ref.current as unknown) as HTMLElement).querySelector(tag_type)?.value;

  useEffect(() => {
    if (this_list === undefined) {
      fetchList();
    }
  }, []);

  // const [
  //   s_editWorkspace,
  //   { loading: sa_loading, error: sa_error, called: sa_called },
  // ] = useMutation(S_EDIT_WORKSPACE, {
  //   onCompleted({ res }) {
  //     setOpen(!saveSnackBarOpen);
  //   },
  //   onError(error: ApolloError) {
  //     console.log(error);
  //   },
  // });

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      <pre>{JSON.stringify(this_list, null, 1)}</pre>
      {editSetData ? (
        <>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridName}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                ref={inputName}
                required
                defaultValue={this_list?.name ?? data?.getList.name ?? ""}
                className={classes.name}
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridDescription}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                id="description"
                ref={inputDescription}
                required
                multiline
                rowsMax={4}
                variant="outlined"
                defaultValue={this_list?.description ?? ""}
                className={classes.description}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            direction="row"
            className={classes.gridButtonArea}
            spacing={1}
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Icon>clear</Icon>}
                disableRipple
                disableTouchRipple
                className={classes.cancelEditButton}
                onClick={() => setEditSetData(!editSetData)}
              >
                Cancel Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                endIcon={<Icon>arrow_right</Icon>}
                disableRipple
                disableTouchRipple
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setEditSetData(!editSetData);
                  setOpen(!saveSnackBarOpen);
                  if (inputName === null || inputDescription === null) return;
                  setChange([
                    {
                      key: "name",
                      value: getValueFromHTMLElement(
                        inputName,
                        "input"
                      ) as string,
                    },
                    {
                      key: "description",
                      value: getValueFromHTMLElement(
                        inputDescription,
                        "textarea"
                      ) as string,
                    },
                  ]);

                  // s_editWorkspace({
                  //   variables: { ...l_data, id: getCurrentWS().id },
                  // });
                }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Card className={classes.root}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this_list?.name ?? data?.getList.name ?? ""}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {this_list?.description ?? ""}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              disableRipple
              disableTouchRipple
              onClick={() => setEditSetData(!editSetData)}
            >
              Edit
            </Button>
          </CardActions>
        </Card>
      )}

      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
