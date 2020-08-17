import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Icon,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import SetListTable from "../../components/set/SetListTable";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { S_ADD_ADDEES } from "../../api/graphql/listQueries";
import { returnData, createData } from "../../pages/set/ListPage";

interface Props {
  list_id: string | undefined;
  selected: {
    items: number[];
    sets: number[];
  };
  targets: {
    items: Item.Items;
    sets: ApparatusSet.Sets;
  };
  callSnackBarOpenHandler: () => void;
}

const ListEditPageAddSection: FC<Props> = (props) => {
  const { list_id, selected, targets, callSnackBarOpenHandler } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { getAddableState, getAddableAddFrom } = useListHelpers;
  const is_addable = useSelector(getAddableState);
  const add_from = useSelector(getAddableAddFrom);
  const {
    addSelectedTarget,
    removeUnSelectedTarget,
    updateAddableAddFrom,
  } = useListMetaActions();

  const [
    s_add_addees,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ADDEES, {
    onCompleted({ res }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const addSelectedTargetHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => {
    dispatch(addSelectedTarget({ id, add_to }));
  };

  const removeUnSelectedTargetHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => {
    dispatch(removeUnSelectedTarget({ id, add_to }));
  };

  const onChangeAddableTarget = (e: any) =>
    dispatch(updateAddableAddFrom({ add_from: e.target.value }));

  useEffect(() => {}, [list_id, selected, targets, callSnackBarOpenHandler]);

  return (
    <>
      {is_addable ? (
        <Box>
          <AppBar position="static" className={classes.addableAppBar}>
            <Toolbar variant="dense">
              <Grid container alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color="inherit">
                    Add From
                  </Typography>
                </Grid>
                <Grid item>
                  <Select
                    id="type"
                    required
                    variant="outlined"
                    autoWidth
                    defaultValue={add_from ?? "sets"}
                    className={classes.formType}
                    onChange={onChangeAddableTarget}
                  >
                    <MenuItem value="items">Item</MenuItem>
                    <MenuItem value="sets">Set</MenuItem>
                  </Select>
                </Grid>

                {selected[add_from]?.length > 0 ? (
                  <>
                    <Grid item>
                      <Typography variant="h6" color="inherit">
                        {selected[add_from].length + " selected"}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                        onClick={() => {
                          const variables = {
                            id: Number(list_id),
                            addee_type: add_from,
                            addee_ids: selected[add_from],
                          };
                          s_add_addees({
                            variables,
                          });
                        }}
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
          </AppBar>
          {targets?.sets !== undefined && targets?.sets.length > 0 ? (
            <div>
              <SetListTable
                returnData={returnData}
                createData={createData}
                data={targets?.sets}
                selectable={{
                  is_selectable: true,
                  add: addSelectedTargetHandler,
                  remove: removeUnSelectedTargetHandler,
                  selected,
                }}
              />
            </div>
          ) : (
            <div>No set</div>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export { ListEditPageAddSection as default };
