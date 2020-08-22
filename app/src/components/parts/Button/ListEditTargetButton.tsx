import React, { useEffect, SyntheticEvent, FC } from "react";
import { Button } from "@material-ui/core";

interface IProps {
  name: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const ListEditTargetButton: FC<IProps> = ({ name, handleOnClick }) => {
  useEffect(() => {}, [handleOnClick]);
  return (
    <Button
      size="small"
      color="primary"
      disableRipple
      disableTouchRipple
      onClick={handleOnClick}
    >
      {name}
    </Button>
  );
};
