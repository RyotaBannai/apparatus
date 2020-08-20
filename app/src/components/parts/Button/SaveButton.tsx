import React, { useEffect, SyntheticEvent, FC } from "react";
import { Button, Icon } from "@material-ui/core";

interface IProps {
  name: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const SaveButton: FC<IProps> = ({ name, handleOnClick }) => {
  useEffect(() => {}, [handleOnClick]);
  return (
    <Button
      variant="contained"
      color="primary"
      endIcon={<Icon>arrow_right</Icon>}
      disableRipple
      disableTouchRipple
      onClick={handleOnClick}
    >
      {name}
    </Button>
  );
};
