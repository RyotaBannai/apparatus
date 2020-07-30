import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_WORKSPACES } from "../../modules/workspace/queries";
import { useWorkspace } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/workspace/page.style";
import {
  Button,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";

interface Props {}
export const CreatePage: FC<Props> = () => {
  const { addateWS } = useWorkspace();
  const classes = useStyles();

  //   const { data } = useQuery(S_GET_WORKSPACES);

  //   const [
  //     s_createWorkspace,
  //     { loading: sa_loading, error: sa_error, called: sa_called },
  //   ] = useMutation(S_CREATE_WORKSPACE, {
  //     onCompleted({ res }) {
  //       console.log("workspace was successfully created!");
  //     },
  //     onError(error: ApolloError) {
  //       console.log(error);
  //     },
  //   });

  //   if (sa_loading) return <p>Loading...</p>;
  //   if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Workspace List</h2>
    </div>
  );
};
