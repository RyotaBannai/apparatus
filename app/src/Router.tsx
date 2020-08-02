import React, { FC } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "./pages/layouts/Layout";
import { CreatePage as CreateWorkspacePage } from "./pages/workspace/CreatePage";
import { ListPage as ListWorkspacePage } from "./pages/workspace/ListPage";
import { EditPage as EditWorkspacePage } from "./pages/workspace/EditPage";
import { AddPage as AddItemPage } from "./pages/item/AddPage";
import { Sub } from "./pages/Sub";
import { Pagination } from "./pages/DemoPagination";
import { Login } from "./pages/Login";
import { Signin } from "./pages/Signin";

interface Props {}
export const ApparatusRouter: FC<Props> = () => {
  return (
    <Router>
      <Layout>
        <Route exact path="/create_workspace" component={CreateWorkspacePage} />
        <Route exact path="/list_workspace" component={ListWorkspacePage} />
        <Route exact path="/edit_workspace" component={EditWorkspacePage} />
        <Route exact path="/item" component={AddItemPage} />
        <Route exact path="/sub" component={Sub} />
        <Route exact path="/pagination" component={Pagination} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signin" component={Signin} />
      </Layout>
    </Router>
  );
};
