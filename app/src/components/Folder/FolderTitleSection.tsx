import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { FolderTitleControls } from "./FolderTitleControls";

interface IProps {
  parents: JSX.Element[];
}
export const FolderTitleSection: FC<IProps> = (props) => {
  const { parents } = props;
  return (
    <Card>
      <CardContent style={{ padding: "16px 16px 0 16px" }}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={10}>
            <Typography variant="body1" color="textSecondary" component="p">
              {parents !== undefined ? (
                parents.map((parent: JSX.Element) => parent)
              ) : (
                <></>
              )}
            </Typography>
            <CardContent>
              <Typography variant="h5" color="textPrimary" component="h2">
                {"Folder title here"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {"Folder description here"}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={2}>
            <FolderTitleControls />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};