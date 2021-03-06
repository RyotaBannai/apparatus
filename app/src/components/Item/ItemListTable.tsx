import React, { useEffect, FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { returnData } from "./service";
import ItemListTableRow from "../../components/Item/ItemListTableRow";

interface IProps {
  data: Array<Item.Item & { item_meta: Item.ItemMeta }>;
  selectable: ApparatusList.Selectable;
}

const ItemListTable: FC<IProps> = (props) => {
  const { data, selectable } = props;

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
            <TableCell>Data</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData(data).map((row) => (
            <ItemListTableRow
              is_set={false}
              key={uuidv4()}
              row={row}
              selectable={selectable}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ItemListTable as default };
