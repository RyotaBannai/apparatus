import React, { useEffect, useCallback, FC } from "react";
import { useMutation, ApolloError, ApolloQueryResult } from "@apollo/client";
import { S_DELETE_LISTS } from "../../api/graphql/folderQueries";
import { useSelector } from "react-redux";
import { useFolderHelpers } from "../../features/folder/folderHelpers";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { StyledAppBar } from "../Parts/StyleAppBar";

interface Props {
  id_deletable: boolean;
  folder_id: string;
  callSnackBarOpenHandler: () => void;
  refetchFolder: (
    variables?:
      | Partial<{
          id: string;
          wsId: number;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const FolderDeleteListSection: FC<Props> = (props) => {
  const {
    id_deletable,
    folder_id,
    callSnackBarOpenHandler,
    refetchFolder,
  } = props;
  const { getDeletable } = useFolderHelpers;
  const { selected_lists } = useSelector(getDeletable);

  const [s_deleteLists] = useMutation(S_DELETE_LISTS, {
    onCompleted({ deleteLists }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  let deleteListsFromFolderHandler = useCallback(async () => {
    const variables = {
      folderId: Number(folder_id),
      listIds: selected_lists.map((listId: string) => Number(listId)),
    };
    await s_deleteLists({ variables });
    refetchFolder();
  }, [s_deleteLists, selected_lists, folder_id, refetchFolder]);

  useEffect(() => {}, [id_deletable]);

  return (
    <>
      {id_deletable ? (
        <Box>
          <Typography
            variant="h5"
            color="textPrimary"
            component="p"
            style={{ marginLeft: 10, marginTop: 30 }}
          >
            Delete Form
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          <StyledAppBar position="static">
            <Toolbar variant="dense">
              <Grid container alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color="inherit">
                    Delete
                  </Typography>
                </Grid>
                {selected_lists?.length > 0 ? (
                  <>
                    <Grid item>
                      <Typography variant="h6" color="inherit">
                        {selected_lists?.length + " selected"}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                        onClick={deleteListsFromFolderHandler}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </Toolbar>
          </StyledAppBar>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
