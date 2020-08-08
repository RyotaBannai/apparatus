import React, { useState, useEffect, FC } from "react";
import { useQuery } from "@apollo/client";
import { L_GET_ITEM } from "../../modules/item/queries";
import { useSet } from "../../modules/set/actions";
import {
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useStyles } from "../../assets/style/item/item.style";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";

interface Props {
  set_id: number;
  id: number;
  type?: string;
  data?: string;
  description?: string;
  note?: string;
  hideSet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApparatusItem: FC<Props> = ({
  set_id,
  id,
  type,
  data,
  description,
  note,
  hideSet,
}) => {
  const classes = useStyles();
  const { addateItem, deleteItem } = useSet();
  const [show, setShow] = useState<boolean>(true);
  const { data: this_item } = useQuery(L_GET_ITEM, {
    variables: {
      set_id,
      id,
    },
  });
  const { addateItem: addateItemAction } = useSetActions();
  const dispatch = useDispatch();

  const onChangeType = (e: any) => handleEvent(e, "type");
  const onChangeData = (e: any) => handleEvent(e, "data");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const onChangeNote = (e: any) => handleEvent(e, "note");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(form_name, e.target.value);
  };
  const setChange = (update_data: string, value: string) => {
    let item: any = {
      id: id,
      [update_data]: value,
      update_data: update_data,
    };
    addateItem({
      set_id,
      item,
    });
    dispatch(
      addateItemAction({
        set_id,
        item,
      })
    );
  };

  const onDeleteItem = (e: any) => {
    e.preventDefault();
    setShow(!show);
    let left_items: number = deleteItem(set_id, id);
    if (left_items === 0) hideSet(false);
  };

  useEffect(() => {
    if (type === undefined && data === undefined) setChange("type", "line");
  }, []);

  if (!show) return <></>;
  else
    return (
      <div className={classes.item}>
        {this_item?.getItem?.type === "line" ? (
          <Grid container alignItems="flex-end" direction="row" spacing={1}>
            <Grid item>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                id="type"
                required
                variant="outlined"
                autoWidth
                defaultValue={this_item?.getItem?.type ?? type ?? "line"}
                className={classes.formType}
                onChange={onChangeType}
              >
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="field">Field</MenuItem>
              </Select>
            </Grid>
            <Grid item className={classes.gridItemLine}>
              <InputLabel htmlFor="data">Data</InputLabel>
              <OutlinedInput
                id="data"
                required
                defaultValue={this_item?.getItem?.data ?? data ?? ""}
                className={classes.formDataLine}
                onChange={onChangeData}
              />
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container alignItems="flex-end" direction="row" spacing={1}>
              <Grid item>
                <InputLabel htmlFor="type">Type</InputLabel>
                <Select
                  id="type"
                  required
                  variant="outlined"
                  autoWidth
                  defaultValue={this_item?.getItem?.type ?? type ?? "line"}
                  className={classes.formType}
                  onChange={onChangeType}
                >
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="field">Field</MenuItem>
                </Select>
              </Grid>
              <Grid
                container
                alignItems="flex-end"
                direction="row"
                spacing={1}
              />
              <Grid item className={classes.gridItem}>
                <InputLabel htmlFor="data">Data</InputLabel>
                <TextField
                  id="data"
                  required
                  multiline
                  rowsMax={4}
                  variant="outlined"
                  defaultValue={this_item?.getItem?.data ?? data ?? ""}
                  className={classes.formDataField}
                  onChange={onChangeData}
                />
              </Grid>
            </Grid>
          </>
        )}
        <Grid container alignItems="flex-end" direction="row" spacing={1}>
          <Grid item className={classes.gridItem}>
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextField
              id="description"
              multiline
              rowsMax={2}
              variant="outlined"
              defaultValue={description ?? ""}
              className={classes.description}
              onChange={onChangeDescription}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="flex-end" direction="row" spacing={1}>
          <Grid item className={classes.gridItem}>
            <InputLabel htmlFor="note">Note</InputLabel>
            <TextField
              id="note"
              multiline
              rowsMax={2}
              variant="outlined"
              defaultValue={note ?? ""}
              className={classes.note}
              onChange={onChangeNote}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Delete" placement="top">
              <Icon className={classes.deleteForm} onClick={onDeleteItem}>
                delete_forever
              </Icon>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    );
};
