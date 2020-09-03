import React, {
  useState,
  useEffect,
  useCallback,
  FC,
  ChangeEvent,
} from "react";
import { useMutation, ApolloError, ApolloQueryResult } from "@apollo/client";
import { S_UPDATE_LIST } from "../../api/graphql/listQueries";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import { useListActions } from "../../features/list/listFeatureSlice";
import { SaveButton } from "../Parts/Button/SaveButton";
import { Name } from "../Parts/Grid/Name";
import { Description } from "../Parts/Grid/Description";
import { ListEditPageTitleControls } from "./ListEditPageTitleControls";

interface Props {
  data: ApparatusList.ListData;
  deleteList: () => Promise<void>;
  is_deletable: boolean;
  is_addable: boolean;
  toggleDeletableHandler: () => void;
  toggleAddableHandler: () => void;
  callSnackBarOpenHandler: () => void;
  refetchList: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

const ListEditPageTitleSection: FC<Props> = (props) => {
  const {
    data,
    deleteList,
    is_deletable,
    is_addable,
    toggleDeletableHandler,
    toggleAddableHandler,
    callSnackBarOpenHandler,
    refetchList,
  } = props;
  const classes = useStyles();
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(data?.name ?? "");
  const [description, setDescription] = useState<string>(
    data?.description ?? ""
  );

  const handleOnChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setName(e.target.value),
    [name]
  );

  const handleOnChangeDescription = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDescription(e.target.value),
    [description]
  );

  const editModeHandler = useCallback(() => setEditMode(!edit_mode), [
    edit_mode,
  ]);

  const [s_updateAddees] = useMutation(S_UPDATE_LIST, {
    onCompleted({ deleteAddees }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const saveChangeHandler = useCallback(async () => {
    const variables = {
      name,
      description,
      id: Number(data?.id_on_server),
    };
    await s_updateAddees({
      variables,
    });
    await refetchList();
    editModeHandler();
  }, [name, description, refetchList]);

  useEffect(() => {}, [data, callSnackBarOpenHandler]);

  return (
    <Card className={classes.listName}>
      <CardContent>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={10}>
            {edit_mode ? (
              <>
                <Grid container alignItems="center" direction="row" spacing={1}>
                  <Name
                    id="name"
                    labelName="Name"
                    defaultValue={data?.name}
                    fallbackValue={""}
                    handleOnChange={handleOnChangeName}
                  />
                </Grid>
                <Grid container alignItems="center" direction="row" spacing={1}>
                  <Description
                    id="description"
                    labelName="Description"
                    defaultValue={data?.description}
                    fallbackValue={""}
                    handleOnChange={handleOnChangeDescription}
                  />
                </Grid>
                <Grid container alignItems="center" direction="row" spacing={1}>
                  <Grid item>
                    <SaveButton
                      name="Save Change"
                      handleOnClick={saveChangeHandler}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Typography gutterBottom variant="h5" component="h2">
                  {data?.name ?? ""}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {data?.description ?? ""}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={2}>
            <ListEditPageTitleControls
              deleteList={deleteList}
              editList={editModeHandler}
              is_edit_mode={edit_mode}
              is_deletable={is_deletable}
              is_addable={is_addable}
              toggleDeletableHandler={toggleDeletableHandler}
              toggleAddableHandler={toggleAddableHandler}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { ListEditPageTitleSection as default };
