import React, { useEffect, SyntheticEvent, FC, ChangeEvent } from "react";
import { Grid, InputLabel, OutlinedInput } from "@material-ui/core";
import styled from "styled-components";

interface IProps {
  id: string;
  defaultValue: string;
  fallbackValue: string;
  labelName: string;
  handleOnChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void | undefined;
}
export const Name: FC<IProps> = (props) => {
  const { id, defaultValue, fallbackValue, labelName, handleOnChange } = props;
  useEffect(() => {}, [
    id,
    defaultValue,
    fallbackValue,
    labelName,
    handleOnChange,
  ]);
  return (
    <StyledGrid item>
      <InputLabel htmlFor={id}>{labelName}</InputLabel>
      <StyledOutlinedInput
        id={id}
        required
        defaultValue={defaultValue ?? fallbackValue}
        onChange={handleOnChange}
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
