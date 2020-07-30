import React from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { ApolloClient, ApolloError } from "apollo-client";
import gql from "graphql-tag";
import {
  Button,
  Input,
  InputLabel,
  OutlinedInput,
  Grid,
  Icon,
} from "@material-ui/core";

const ADD_USER = gql`
  mutation CREATE($name: String, $email: String, $password: String) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      token
      expires_in
    }
  }
`;

interface Props {}

export const Signin: React.FC<Props> = () => {
  let name: any = "";
  let email: any = "";
  let password: any = "";
  const [addUser, { data, loading, called }] = useMutation(ADD_USER, {
    context: {
      headers: {
        "operation-name": "SIGNIN",
      },
    },
    onCompleted({ createUser: { token } }) {
      localStorage.setItem("token", token as string);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });
  return (
    <div>
      <h2>Sign In</h2>
      <div style={{ margin: "10px" }}>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
          <Grid item>
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              required
              inputRef={(node) => {
                name = node;
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              required
              inputRef={(node) => {
                email = node;
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              required
              inputRef={(node) => {
                password = node;
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon>arrow_right</Icon>}
              onClick={(e: any) => {
                e.preventDefault();
                let variables: any = {
                  name: name.value,
                  email: email.value,
                  password: password.value,
                };
                addUser({
                  variables,
                });
                name.value = "";
                email.value = "";
                password.value = "";
              }}
            >
              Sign In
            </Button>
          </Grid>
          <Grid item>{JSON.stringify(data)}</Grid>
        </Grid>
      </div>
    </div>
  );
};
