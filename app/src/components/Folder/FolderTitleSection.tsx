import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";

import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";

interface IProps {
  parents: JSX.Element[];
}
export const FolderTitleSection: FC<IProps> = (props) => {
  const { parents } = props;
  return (
    <Card>
      <CardContent style={{ padding: "16px 16px 0 16px" }}>
        <Typography variant="body1" color="textSecondary" component="p">
          {parents !== undefined ? (
            parents.map((parent: JSX.Element) => parent)
          ) : (
            <></>
          )}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h5" color="textPrimary" component="h2">
          {"Folder title here"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {"Folder description here"}
        </Typography>
      </CardContent>
    </Card>
  );
};
