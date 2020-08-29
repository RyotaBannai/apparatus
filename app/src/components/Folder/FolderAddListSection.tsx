import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFolderActions } from "../../features/folder/folderFeatureSlice";
import { useFolderHelpers } from "../../features/folder/folderHelpers";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
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
import ListEditPageTable from "../List/ListEditPageTable";

interface Props {
  lists: ApparatusList.ListData[];
}
export const FolderAddListSection: FC<Props> = (props) => {
  const { lists } = props;
  const {
    addSelectedList,
    removeSelectedList,
    toggleAddableState,
  } = useFolderActions();
  const { getAddable } = useFolderHelpers;
  const { is_addable, selected_lists } = useSelector(getAddable);
  const dispatch = useDispatch();

  const onAddSelectedListHandler = (id: string) =>
    dispatch(addSelectedList({ list_id: id }));
  const onRemoveSelectedListHandler = (id: string) =>
    dispatch(removeSelectedList({ list_id: id }));

  const selectable: Folder.Selectable = {
    is_selectable: true,
    add: onAddSelectedListHandler,
    remove: onRemoveSelectedListHandler,
    selected: selected_lists,
  };

  useEffect(() => {}, [lists]);

  return (
    <>
      {is_addable ? (
        <Box>
          <Typography
            variant="h5"
            color="textPrimary"
            component="p"
            style={{ marginLeft: 10, marginTop: 30 }}
          >
            Add Form
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          <StyledAppBar position="static">
            <Toolbar variant="dense">
              <Grid container alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color="inherit">
                    Add From List
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
                        onClick={() => null}
                      >
                        Add
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </Toolbar>
          </StyledAppBar>
          {lists?.length > 0 ? (
            <ListEditPageTable data={lists} selectable={selectable} />
          ) : (
            <div>No list found</div>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};