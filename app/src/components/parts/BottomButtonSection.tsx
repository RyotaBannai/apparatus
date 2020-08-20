import React, { useEffect, SyntheticEvent, FC } from "react";
import { Grid } from "@material-ui/core";
import { SaveButton } from "../../components/parts/Button/SaveButton";
import { DeleteButton } from "../../components/parts/Button/DeleteButton";
import { AddButton } from "../../components/parts/Button/AddButton";

interface IProps {
  nameSave?: string;
  nameDelete?: string;
  nameAdd?: string;
  mode: Global.Mode;
  handleOnAdd?: (e: SyntheticEvent) => void | undefined;
  handleOnSave?: (e: SyntheticEvent) => void | undefined;
  handleOnDelete?: (e: SyntheticEvent) => void | undefined;
}

export const BottomButtonSection: FC<IProps> = ({
  nameSave,
  nameDelete,
  nameAdd,
  mode,
  handleOnSave,
  handleOnAdd,
  handleOnDelete,
}) => {
  useEffect(() => {}, [handleOnSave, handleOnAdd, handleOnDelete]);
  return (
    <Grid container alignItems="center" direction="row" spacing={1}>
      {mode === "edit" ? (
        <DeleteButton
          name={nameDelete ?? "Delete"}
          handleOnClick={handleOnDelete}
        />
      ) : (
        <AddButton name={nameAdd ?? "Add"} handleOnClick={handleOnAdd} />
      )}
      <Grid item>
        <SaveButton name={nameSave ?? "Save"} handleOnClick={handleOnSave} />
      </Grid>
    </Grid>
  );
};
