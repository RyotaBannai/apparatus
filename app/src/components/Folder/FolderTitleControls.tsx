import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  SyntheticEvent,
  FC,
} from "react";
import { useFolderActions } from "../../features/folder/folderFeatureSlice";
import { useFolderHelpers } from "../../features/folder/folderHelpers";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Icon } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import EditIcon from "@material-ui/icons/Edit";
import { COLOR } from "../../constants/color";

interface IProps {
  createNewFolder: () => Promise<void>;
  deleteFolder: () => Promise<void>;
  editFolder: () => void;
  is_edit_mode: boolean;
}
export const FolderTitleControls: FC<IProps> = (props) => {
  const { createNewFolder, deleteFolder, editFolder, is_edit_mode } = props;
  const [open, setOpen] = useState(false);
  const { addSelectedList, toggleAddableState } = useFolderActions();
  const { getAddable } = useFolderHelpers;
  const dispatch = useDispatch();
  const { is_addable } = useSelector(getAddable);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleAddableHandler = useCallback(
    () => dispatch(toggleAddableState({ is_addable: !is_addable })),
    [is_addable]
  );

  const onColorAdd = useCallback(
    (value: boolean) => (value ? COLOR.PRIMARY : "inherit"),
    []
  );

  interface IAction {
    icon: JSX.Element;
    name: string;
    handler: () => void;
  }

  const actions: IAction[] = [
    {
      icon: <ViewHeadlineIcon style={{ color: onColorAdd(is_addable) }} />,
      name: is_addable ? "Quit Add List" : "Add List",
      handler: toggleAddableHandler,
    },
    {
      icon: <ViewColumnIcon />,
      name: "Add Folder",
      handler: createNewFolder,
    },
    {
      icon: <EditIcon style={{ color: onColorAdd(is_edit_mode) }} />,
      name: is_edit_mode ? "Quit Edit Folder" : "Edit Folder",
      handler: editFolder,
    },
    { icon: <Icon>delete</Icon>, name: "Delete Folder", handler: deleteFolder },
  ];
  useEffect(() => {}, [
    createNewFolder,
    deleteFolder,
    editFolder,
    is_edit_mode,
  ]);

  return (
    <StyledSpeedDial
      ariaLabel="SpeedDial openIcon example"
      icon={<SpeedDialIcon openIcon={<BlurOnIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction={"down"}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            handleClose();
            action.handler();
          }}
        />
      ))}
    </StyledSpeedDial>
  );
};

const StyledSpeedDial = styled(SpeedDial)`
  position: absolute;
  right: 35px !important;
  bottom: unset !important;
`;
