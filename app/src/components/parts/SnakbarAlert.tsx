import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {
  isOpen: boolean;
}

export const SnakbarAlert: FC<Props> = ({ isOpen }) => {
  const [saveSnackBarOpen, setOpen] = useState(false);
  const [prevSnackBarOpen, setPrevOpen] = useState(false);
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    if (prevSnackBarOpen) setOpen(true);
    else {
      setOpen(isOpen);
      setPrevOpen(true);
    }
  }, [isOpen]);
  return (
    <Snackbar
      open={saveSnackBarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success">
        Successfully saved!
      </Alert>
    </Snackbar>
  );
};
