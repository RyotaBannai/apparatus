import React, { FC } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { returnData } from "./service";
import ListEditPageRow from "./ListEditPageTableRow";

interface IProps {
  data: ApparatusList.ListData[];
  selectable: Folder.Selectable;
}

const ListEditPageTable: FC<IProps> = (props) => {
  const { data, selectable } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {selectable.is_selectable ? (
              <TableCell style={{ width: "10%" }}></TableCell>
            ) : (
              <></>
            )}
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Item / Set Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData(data).map((row) => (
            <ListEditPageRow key={uuidv4()} row={row} selectable={selectable} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ListEditPageTable as default };
