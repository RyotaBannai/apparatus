import React, { useEffect, SyntheticEvent, FC, ChangeEvent } from "react";
import { Grid, InputLabel, TextField } from "@material-ui/core";
import styled from "styled-components";

interface IProps {
  id: string;
  defaultValue: string | null | undefined;
  fallbackValue: string;
  labelName: string;
  handleOnChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void | undefined;
}
export const Description: FC<IProps> = (props) => {
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
      <StyledTextField
        id={id}
        required
        multiline
        rowsMax={4}
        variant="outlined"
        defaultValue={defaultValue ?? fallbackValue}
        onChange={handleOnChange}
      />
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid)`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  width: 50%;
  & textarea {
    min-height: 100px;
  }
`;
