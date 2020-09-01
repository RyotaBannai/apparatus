import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/workspace/page.style";
import { Checkbox, TableCell, TableRow } from "@material-ui/core";
import { createData } from "./service";

interface ILinkProp {
  link: string;
  cell_content?: string | number | null;
}

const WrapCellWithLink: FC<ILinkProp> = (props) => {
  const { link, cell_content } = props;
  const history = useHistory();
  return (
    <TableCell onClick={() => history.push(link)} style={{ cursor: "pointer" }}>
      {cell_content}
    </TableCell>
  );
};

const returnWrappedComponent = (link: string) => (
  cell_content?: string | number | null
) => <WrapCellWithLink link={link} cell_content={cell_content} />;

interface IProps {
  row: ReturnType<typeof createData>;
  selectable: Folder.Selectable;
}

function ListEditPageTableRow(props: IProps) {
  const {
    row,
    selectable: { is_selectable, add, remove, selected },
  } = props;
  const classes = useStyles();
  const is_selected = selected?.includes(row.id);
  const cell = returnWrappedComponent(`/list_edit/${row.id}`);

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const id = e.target.value as string;
    if (is_checked === true && add !== undefined) {
      add(id);
    } else if (is_checked === false && remove !== undefined) {
      remove(id);
    }
  }, []);

  return (
    <TableRow hover className={classes.root}>
      {is_selectable ? (
        <TableCell>
          <Checkbox
            checked={is_selected}
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            size={"small"}
            onChange={pressCheckBoxHandler}
            value={row.id}
          />
        </TableCell>
      ) : (
        <></>
      )}
      {cell(row.name)}
      {cell(row.description)}
      {cell(row.targets_count)}
    </TableRow>
  );
}

export { ListEditPageTableRow as default };
