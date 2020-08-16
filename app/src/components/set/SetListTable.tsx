import React, { useEffect, FC } from "react";
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
import SetListTableRow from "../../components/set/SetListTableRow";

interface Props {
  data: ApparatusSet.Set[];
  returnData: any;
  createData: any;
}

const SetListTable: FC<Props> = (props) => {
  const { data, returnData, createData } = props;

  useEffect(() => {}, [data]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Item Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData(data).map((row: ApparatusSet.createDataType) => (
            <SetListTableRow key={uuidv4()} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { SetListTable as default };
