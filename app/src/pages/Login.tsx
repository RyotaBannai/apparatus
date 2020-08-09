import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { ApolloError } from "apollo-client";
import { useWSHelpers } from "../features/workspace/wsHelpers";
import {
  Button,
  InputLabel,
  OutlinedInput,
  Grid,
  Icon,
} from "@material-ui/core";

const LOGIN = gql`
  query LOGIN($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginFails {
        message
      }
      ... on TokenEntity {
        token
        expires_in
      }
    }
  }
`;

interface Props {}

const Login: React.FC<Props> = () => {
  const { getCurrentWS, setCurrentWS } = useWSHelpers;
  let email: any = "";
  let password: any = "";
  const [login, { called, loading, data }] = useLazyQuery(LOGIN, {
    pollInterval: 0,
    context: {
      headers: {
        "operation-name": "LOGIN",
      },
    },
    onCompleted({ login }) {
      if (login.length > 1) {
        console.log("Return value has an unexpected length.");
        return;
      }
      localStorage.setItem("token", login[0].token as string);
      if (getCurrentWS() === null) setCurrentWS("1");
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <h2>Login</h2>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
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
                  email: email.value,
                  password: password.value,
                };
                login({
                  variables,
                });
              }}
            >
              Login
            </Button>
          </Grid>
          <Grid item>{JSON.stringify(data)}</Grid>
        </Grid>
      </div>
    </div>
  );
};

export { Login as default };
