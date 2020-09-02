import React, { useEffect, useCallback, FC } from "react";
import { useMutation, ApolloError, ApolloQueryResult } from "@apollo/client";
import { S_DELTEE_ADDEES } from "../../api/graphql/listQueries";
import { useSelector } from "react-redux";
import { useListHelpers } from "../../features/list/listHelpers";
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
  is_deletable: boolean;
  list_id: string | undefined;
  callSnackBarOpenHandler: () => void;
  refetchFolder?: (
    variables?:
      | Partial<{
          id: string;
          wsId: number;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const ListEditPageDeleteListSection: FC<Props> = (props) => {
  const {
    is_deletable,
    list_id,
    callSnackBarOpenHandler,
    // refetchFolder,
  } = props;
  const { getDeletable } = useListHelpers;
  const { selected_targets } = useSelector(getDeletable);

  const [s_deleteAddees] = useMutation(S_DELTEE_ADDEES, {
    onCompleted({ deleteAddees }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  let deleteTargetsFromFolderHandler = useCallback(async () => {
    const { items, sets } = selected_targets;
    const variables = {
      listId: Number(list_id),
      itemIds: items.map((itemId: number) => Number(itemId)),
      setIds: sets.map((setId: number) => Number(setId)),
    };
    await s_deleteAddees({ variables });
    // refetchFolder();
  }, [s_deleteAddees, selected_targets, list_id, is_deletable]);

  const createToolBarContents = () => {
    const { items, sets } = selected_targets;
    return (
      <>
        {items.length > 0 || sets.length > 0 ? (
          <>
            {items.length > 0 ? (
              <Grid item>
                <Typography variant="h6" color="inherit">
                  {items.length +
                    (items.length > 1 ? " items" : " item") +
                    " selected"}
                </Typography>
              </Grid>
            ) : (
              <></>
            )}
            {sets.length > 0 ? (
              <Grid item>
                <Typography variant="h6" color="inherit">
                  {sets.length +
                    (sets.length > 1 ? " sets" : " set") +
                    " selected"}
                </Typography>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                endIcon={<Icon>arrow_right</Icon>}
                disableRipple
                disableTouchRipple
                onClick={deleteTargetsFromFolderHandler}
              >
                Delete
              </Button>
            </Grid>
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  useEffect(() => {}, [is_deletable, selected_targets]);

  return (
    <>
      {is_deletable ? (
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
                {createToolBarContents()}
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
