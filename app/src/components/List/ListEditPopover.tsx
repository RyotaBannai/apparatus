import React, { FC } from "react";
import { Icon, List, ListItem, ListItemText, Popover } from "@material-ui/core";
import styled from "styled-components";

interface IProps {
  top: number | undefined;
  left: number | undefined;
  open: boolean;
  onClose: () => void;
  onHighlightHandler: () => void;
  onUnhighlightHander: () => void;
}

export const ListEditPopover: FC<IProps> = (props) => {
  let {
    top,
    left,
    open,
    onClose,
    onHighlightHandler,
    onUnhighlightHander,
  } = props;

  return (
    <StyledPopover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: top ?? 0,
        left: left ?? 0,
      }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
    >
      <List style={{ padding: 0 }}>
        <PopoverListItem
          content="Highlight"
          onClickHandler={onHighlightHandler}
        />
        <PopoverListItem
          content="Unhighlight"
          onClickHandler={onUnhighlightHander}
        />
        <PopoverListItem content="Make Quiz" onClickHandler={() => {}} />
      </List>
    </StyledPopover>
  );
};

interface IListItem {
  content: string;
  onClickHandler: () => void;
}

const PopoverListItem: FC<IListItem> = (props) => {
  const { content, onClickHandler } = props;
  return (
    <ListItem button onClick={onClickHandler} disableRipple disableTouchRipple>
      <ListItemText primary={content} />
      <Icon>arrow_right</Icon>
    </ListItem>
  );
};

const StyledPopover = styled(Popover)`
  & .MuiPaper-root {
    padding: ${(props) => props.theme.spacing(1)}px;
  }
`;
