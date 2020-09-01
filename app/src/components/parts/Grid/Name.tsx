import React, { useEffect, SyntheticEvent, FC } from "react";
import { Grid, InputLabel, OutlinedInput } from "@material-ui/core";
import styled from "styled-components";

interface IProps {
  id: string;
  defaultValue: string;
  fallbackValue: string;
  labelName: string;
  handleOnClick?: (e: SyntheticEvent) => void | undefined;
}
export const Name: FC<IProps> = (props) => {
  const { id, defaultValue, fallbackValue, labelName, handleOnClick } = props;
  useEffect(() => {}, [
    id,
    defaultValue,
    fallbackValue,
    labelName,
    handleOnClick,
  ]);
  return (
    <StyledGrid item>
      <InputLabel htmlFor="name">{labelName}</InputLabel>
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
  width: 100%;
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  ${({ theme }) => `
  width: 50%;
  & input {
    padding: ${theme.spacing(1)}px;
  }
  `}
`;
