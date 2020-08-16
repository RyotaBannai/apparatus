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
  data: ApparatusSet.Sets | undefined;
  returnData: any;
  createData: any;
  selectable: {
    is_selectable: boolean;
    add?: any;
    remove?: any;
    selected?: any;
  };
}

const SetListTable: FC<Props> = (props) => {
  const { data, returnData, selectable } = props;

  useEffect(() => {}, [data, selectable]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size={"small"}>
        <TableHead>
          <TableRow>
            {selectable.is_selectable ? (
              <TableCell style={{ width: "10%" }} />
            ) : (
              <></>
            )}
            <TableCell>Name</TableCell>
            <TableCell>Item Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData(data).map((row: ApparatusSet.createDataType) => (
            <SetListTableRow key={uuidv4()} row={row} selectable={selectable} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { SetListTable as default };
