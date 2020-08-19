import React, { useEffect, SyntheticEvent, FC } from "react";
import { Grid } from "@material-ui/core";
import { SaveButton } from "../../components/parts/Button/SaveButton";

interface IProps {
  name: string;
  handleOnClick: (e: SyntheticEvent) => void;
}

export const BottomButtonSection: FC<IProps> = ({ name, handleOnClick }) => {
  useEffect(() => {}, [handleOnClick]);
  return (
    <Grid container alignItems="center" direction="row" spacing={1}>
      <Grid item>
        <SaveButton name="Save Edit" handleOnClick={handleOnClick} />
      </Grid>
    </Grid>
  );
};
