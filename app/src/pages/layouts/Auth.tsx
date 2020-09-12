import React, { FC } from "react";
import { useMount } from "react-use";
import { useLocation, Redirect } from "react-router-dom";

interface IProps {}

export const Auth: FC<IProps> = (props) => {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\//g, "");
  const tokenExpiresIn: string | null = localStorage.getItem("expiresIn");
  const isTokenExpired: boolean = new Date().getTime() > Number(tokenExpiresIn);
  if (isTokenExpired) localStorage.setItem("logIn", "0");
  if (!isTokenExpired || ["login", "signin"].includes(currentPath)) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/login" />;
  }
};
