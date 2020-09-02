import React, {
  useState,
  useEffect,
  useCallback,
  FC,
  ChangeEvent,
} from "react";
import { useMutation, ApolloError, ApolloQueryResult } from "@apollo/client";
import { S_UPDATE_FOLDER } from "../../api/graphql/folderQueries";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { FolderTitleControls } from "./FolderTitleControls";
import { SaveButton } from "../../components/Parts/Button/SaveButton";
import { Name } from "../../components/Parts/Grid/Name";
import { Description } from "../../components/Parts/Grid/Description";

interface IProps {
  folder: Folder.Folder;
  parents: JSX.Element[];
  createNewFolder: () => Promise<void>;
  deleteFolder: () => Promise<void>;
  refetchFolder: (
    variables?:
      | Partial<{
          id: string;
          wsId: number;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
  id_deletable: boolean;
  callSnackBarOpenHandler: () => void;
  toggleDeletableHandler: () => void;
}

export const FolderTitleSection: FC<IProps> = (props) => {
  const {
    folder,
    parents,
    createNewFolder,
    deleteFolder,
    refetchFolder,
    id_deletable,
    callSnackBarOpenHandler,
    toggleDeletableHandler,
  } = props;
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(folder?.name);
  const [description, setDescription] = useState<string>(folder?.description);

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

  const [s_updateFolder] = useMutation(S_UPDATE_FOLDER, {
    onCompleted({ updateFolder }) {
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
      id: Number(folder.id),
    };
    await s_updateFolder({ variables });
    await refetchFolder();
    editModeHandler();
  }, [
    s_updateFolder,
    name,
    description,
    editModeHandler,
    callSnackBarOpenHandler,
    toggleDeletableHandler,
  ]);

  useEffect(() => {}, [createNewFolder, deleteFolder]);

  return (
    <Card>
      <CardContent style={{ padding: "16px" }}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={10}>
            {!edit_mode ? (
              <>
                <Typography variant="body1" color="textSecondary" component="p">
                  {parents !== undefined ? (
                    parents.map((parent: JSX.Element) => parent)
                  ) : (
                    <></>
                  )}
                </Typography>
                <CardContent>
                  <Typography variant="h5" color="textPrimary" component="h2">
                    {folder?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {folder?.description}
                  </Typography>
                </CardContent>
              </>
            ) : (
              <>
                <Grid container alignItems="center" direction="row" spacing={1}>
                  <Name
                    id="name"
                    labelName="Name"
                    defaultValue={folder.name}
                    fallbackValue={"List"}
                    handleOnChange={handleOnChangeName}
                  />
                </Grid>
                <Grid container alignItems="center" direction="row" spacing={1}>
                  <Description
                    id="description"
                    labelName="Description"
                    defaultValue={folder.description}
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
            )}
          </Grid>
          <Grid item xs={2}>
            <FolderTitleControls
              createNewFolder={createNewFolder}
              deleteFolder={deleteFolder}
              editFolder={editModeHandler}
              is_edit_mode={edit_mode}
              id_deletable={id_deletable}
              toggleDeletableHandler={toggleDeletableHandler}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
