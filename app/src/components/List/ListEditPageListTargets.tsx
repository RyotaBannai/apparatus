import React, { useEffect, FC } from "react";
import { Box, Divider, Typography } from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import ListEditListItem from "./ListEditListItem";
import ListEditListSet from "./ListEditListSet";
import { v4 as uuidv4 } from "uuid";

interface Props {
  is_deletable: boolean;
  targets: Addee.Addees;
  callSnackBarOpenHandler: () => void;
}

const ListEditPageListTargets: FC<Props> = (props) => {
  const { is_deletable, targets, callSnackBarOpenHandler } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { getDeletable } = useListHelpers;
  const { selected_targets } = useSelector(getDeletable);
  const {
    addSelectedTargetToDeletable,
    removeUnSelectedTargetToDeletable,
  } = useListMetaActions();

  const onAddSelectedListHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => dispatch(addSelectedTargetToDeletable({ id, add_to }));

  const onRemoveSelectedListHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => dispatch(removeUnSelectedTargetToDeletable({ id, add_to }));

  const selectable: ApparatusList.Selectable = {
    is_selectable: is_deletable,
    add: onAddSelectedListHandler,
    remove: onRemoveSelectedListHandler,
    selected: selected_targets,
  };

  useEffect(() => {}, [targets]);

  return (
    <Box className={classes.listBox}>
      <Typography
        variant="h5"
        color="textPrimary"
        component="p"
        style={{ marginLeft: 10 }}
      >
        Contents
      </Typography>
      <Divider style={{ marginBottom: 10 }} />
      {targets?.map((target: Addee.Addee) => {
        if (target.__typename === "ItemData") {
          return (
            <ListEditListItem
              selectable={selectable}
              is_set={false}
              item={target}
              callSnackBarOpenHandler={callSnackBarOpenHandler}
            />
          );
        } else if (target.__typename === "Set") {
          return (
            <ListEditListSet
              selectable={selectable}
              key={uuidv4()}
              set={target}
              callSnackBarOpenHandler={callSnackBarOpenHandler}
            />
          );
        }
      })}
    </Box>
  );
};

export { ListEditPageListTargets as default };
