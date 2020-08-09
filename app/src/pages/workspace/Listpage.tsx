import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_WORKSPACES } from "../../api/graphql/workspaceQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { useStyles } from "../../assets/style/workspace/page.style";
import {
  Button,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

function createData(
  id: string,
  name: string,
  description: string,
  items: Item.Items,
  current_ws_id: string
) {
  return {
    id,
    name,
    description,
    item_count: items.length,
    current_ws_id,
  };
}
interface WrapProps {
  isCurrent: boolean;
  children: React.ReactElement<any, any>;
}

const WrapWithToolTip: FC<WrapProps> = (props) => {
  if (props.isCurrent) {
    return (
      <Tooltip title="Current Workspace" placement="left">
        {props.children}
      </Tooltip>
    );
  } else return props.children;
};

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const classes = useStyles();
  const [goToWS, setGoToWS] = useState<boolean>();
  const { setCurrentWS } = useWSHelpers;
  const isCurrent = (): boolean => row.current_ws_id === row.id;

  return (
    <>
      {!goToWS ? (
        <WrapWithToolTip isCurrent={isCurrent()}>
          <TableRow
            hover
            className={(classes.root, isCurrent() ? classes.currentWS : "")}
            onClick={(e: SyntheticEvent) => !isCurrent() && setGoToWS(!goToWS)}
          >
            <TableCell>
              {isCurrent() ? <KeyboardArrowRightIcon /> : ""} {row.name}
            </TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.item_count}</TableCell>
          </TableRow>
        </WrapWithToolTip>
      ) : (
        <TableRow hover className={classes.root}>
          <TableCell>
            <Tooltip title="Cancel" placement="top">
              <Icon onClick={(e: SyntheticEvent) => setGoToWS(!goToWS)}>
                close
              </Icon>
            </Tooltip>
          </TableCell>
          <TableCell colSpan={2}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon>arrow_right</Icon>}
              disableRipple
              disableTouchRipple
              onClick={(): void => {
                setCurrentWS(row.id);
                window.location.reload();
              }}
            >
              Go to this workspace
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

interface Props {}

const ListPage: FC<Props> = () => {
  const { data, refetch } = useQuery(S_GET_WORKSPACES);
  const { getCurrentWS } = useWSHelpers;
  const current_ws_id = getCurrentWS().id as string;
  const returnData = (
    workspaces: Array<Workspace.Workspace & { id: string; items: Item.Items }>
  ) => {
    let rows: ReturnType<typeof createData>[] = [];
    for (const { id, name, description, items } of workspaces) {
      rows = [...rows, createData(id, name, description, items, current_ws_id)];
    }
    return rows;
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {data?.getWorkspaces.length > 0 ? (
        <div>
          <h2>Workspace List</h2>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Item Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnData(data.getWorkspaces).map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>No workspace</div>
      )}
    </>
  );
};

export { ListPage as default };
