import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import { StylesProvider } from "@material-ui/styles";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <StylesProvider injectFirst>
    <App />
  </StylesProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
