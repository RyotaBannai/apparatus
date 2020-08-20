import React, { useEffect, SyntheticEvent, FC } from "react";
import { Button, Icon } from "@material-ui/core";
import styled from "styled-components";
import blueGrey from "@material-ui/core/colors/blueGrey";

interface IProps {
  name: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const DeleteButton: FC<IProps> = ({ name, handleOnClick }) => {
  useEffect(() => {}, [handleOnClick]);
  return (
    <StyledButton
      variant="contained"
      color="primary"
      startIcon={<Icon>delete</Icon>}
      disableRipple
      disableTouchRipple
      onClick={handleOnClick}
    >
      {name}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  background-color: ${blueGrey[800]};
  &:hover {
    background-color: ${blueGrey[900]};
  }
  &:focus {
    background-color: ${blueGrey[900]};
    outline-color: ${blueGrey[900]};
`;
