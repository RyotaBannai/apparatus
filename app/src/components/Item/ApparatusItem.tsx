import React, { useState, useEffect } from "react";
import { useSet } from "../../modules/set/actions";
import {
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formType: {
      minWidth: 80,
      "& div": {
        padding: theme.spacing(1),
      },
    },
    formData: {
      minWidth: 120,
      "& input": {
        padding: theme.spacing(1),
      },
    },
    deleteForm: {
      cursor: "pointer",
      color: blueGrey[800],
    },
    toSet: {
      cursor: "pointer",
      color: cyan[700],
      "&:hover": {
        color: cyan[800],
      },
      "&:focus": {
        color: cyan[800],
      },
    },
  })
);

interface Props {
  set_id: number;
  id: number;
  type?: string;
  data?: string;
  hideSet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApparatusItem: React.FC<Props> = ({
  set_id,
  id,
  type,
  data,
  hideSet,
}) => {
  const classes = useStyles();
  const { addItem, deleteItem } = useSet();
  const [show, setShow] = useState<boolean>(true);
  const onChangeType = (e: any) => {
    e.preventDefault();
    setChange("type", e.target.value);
  };
  const onChangeData = (e: any) => {
    e.preventDefault();
    setChange("data", e.target.value);
  };
  const setChange = (update_data: string, value: string) => {
    const update_key = update_data === "type" ? "type" : "data";
    let item: any = {
      id: id,
      [update_key]: value,
      update_data: update_data,
    };
    addItem({
      id: set_id,
      item,
    });
  };
  const onDeleteItem = (e: any) => {
    e.preventDefault();
    setShow(!show);
    let left_items: number = deleteItem(set_id, id);
    if (left_items === 0) hideSet(false);
  };
  useEffect(() => {
    setChange("type", "line");
  }, []);

  if (!show) return <></>;
  else
    return (
      <Grid container alignItems="flex-end" direction="row" spacing={1}>
        <Grid item>
          <InputLabel htmlFor="type">Type</InputLabel>
          <Select
            id="type"
            required
            className={classes.formType}
            variant="outlined"
            autoWidth
            defaultValue={type ?? "line"}
            onChange={onChangeType}
          >
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="field">Field</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <InputLabel htmlFor="data">Data</InputLabel>
          <OutlinedInput
            id="data"
            required
            className={classes.formData}
            defaultValue={data ?? ""}
            onChange={onChangeData}
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
    );
};
