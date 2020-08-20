import React, { useEffect, SyntheticEvent, FC } from "react";
import { Button, Icon } from "@material-ui/core";
import styled from "styled-components";
import cyan from "@material-ui/core/colors/cyan";

interface IProps {
  name: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const AddButton: FC<IProps> = ({ name, handleOnClick }) => {
  useEffect(() => {}, [handleOnClick]);
  return (
    <StyledButton
      variant="contained"
      startIcon={<Icon>add_circle</Icon>}
      disableRipple
      disableTouchRipple
      onClick={handleOnClick}
    >
      {name}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  color: #fff;
  background-color: ${cyan[700]};
  &:hover {
    background-color: ${cyan[800]};
  }
  &:focus {
    outline-color: ${cyan[800]};
  }
`;
