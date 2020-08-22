import React, { useEffect, useCallback, FC } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { useMutation, ApolloError } from "@apollo/client";
import { S_ADD_ADDEES } from "../../api/graphql/listQueries";
import ItemListTable from "../Item/ItemListTable";
import SetListTable from "../Set/SetListTable";

interface IProps {
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

const ListEditPageAddSection: FC<IProps> = (props) => {
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

  const [s_add_addees] = useMutation(S_ADD_ADDEES, {
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

  const onClickAddAddeeHandler = () => {
    const variables = {
      id: Number(list_id),
      addee_type: add_from,
      addee_ids: selected[add_from],
    };
    s_add_addees({
      variables,
    });
  };

  const displayTargetsList = useCallback(() => {
    if (targets[add_from] !== undefined && targets[add_from].length > 0) {
      if (add_from === "sets") {
        return (
          <div>
            <SetListTable
              data={targets?.sets}
              selectable={{
                is_selectable: true,
                add: addSelectedTargetHandler,
                remove: removeUnSelectedTargetHandler,
                selected,
              }}
            />
          </div>
        );
      } else if (add_from === "items") {
        return (
          <div>
            <ItemListTable
              data={targets?.items}
              selectable={{
                is_selectable: true,
                add: addSelectedTargetHandler,
                remove: removeUnSelectedTargetHandler,
                selected,
              }}
            />
          </div>
        );
      }
    } else {
      return <div>No data</div>;
    }
  }, [targets, add_from]);

  useEffect(() => {}, [list_id, selected, targets, callSnackBarOpenHandler]);

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
                        onClick={onClickAddAddeeHandler}
                      >
                        Add
                      </Button>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="inherit">
                        to this list
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </Toolbar>
          </AppBar>
          {displayTargetsList()}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export { ListEditPageAddSection as default };
