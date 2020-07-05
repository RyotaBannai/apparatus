import React from "react";
import Nav from "./Nav";

interface Props {}

export const Index: React.FC<Props> = (props) => {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <Nav />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
