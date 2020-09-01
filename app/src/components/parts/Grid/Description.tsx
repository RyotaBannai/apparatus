import React, { useEffect, SyntheticEvent, FC } from "react";
import { Grid, InputLabel, OutlinedInput } from "@material-ui/core";
import styled from "styled-components";

interface IProps {
  id: string;
  defaultValue: string;
  fallbackValue: string;
  name: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const Name: FC<IProps> = (props) => {
  const { id, defaultValue, fallbackValue, name, handleOnClick } = props;
  useEffect(() => {}, [id, defaultValue, fallbackValue, name, handleOnClick]);
  return (
    <StyledGrid item>
      <InputLabel htmlFor="name">Name</InputLabel>
      <StyledOutlinedInput
        id="name"
        required
        defaultValue={defaultValue ?? fallbackValue}
        onChange={handleOnClick}
      />
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid)`
  width: "100%";
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  width: 50%;
  & input {
    padding: ${(props) => props.theme.spacing(1)};
  }
`;
