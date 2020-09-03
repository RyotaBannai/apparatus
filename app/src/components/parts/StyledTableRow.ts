import { TableRow } from "@material-ui/core";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";

export const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: ${grey[100]};
  }
`;
