import styled from "styled-components";
import { AppBar } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";

export const StyledAppBar = styled(AppBar)`
{
  color: #000;
  background-color: ${grey[300]};
  border-radius: 5px;
  margin: 10px 0 25px 0;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  & > h6: {
    font-size: 1rem;
  },
},
`;
