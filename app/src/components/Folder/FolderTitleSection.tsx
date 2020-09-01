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
  folder: Folder.Folder;
  parents: JSX.Element[];
  createNewFolder: () => Promise<void>;
}

export const FolderTitleSection: FC<IProps> = (props) => {
  const { folder, parents, createNewFolder } = props;
  useEffect(() => {}, [createNewFolder]);
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
                {folder.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {folder.description}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={2}>
            <FolderTitleControls createNewFolder={createNewFolder} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
