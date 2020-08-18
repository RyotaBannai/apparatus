import React, { Suspense, lazy, FC } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "../pages/layouts/Layout";
import { Sub } from "../pages/Sub";
import { Pagination } from "../pages/DemoPagination";

const CreateWorkspacePage = lazy(() => import("../pages/workspace/CreatePage"));
const ListWorkspacePage = lazy(() => import("../pages/workspace/Listpage"));
const EditWorkspacePage = lazy(() => import("../pages/workspace/EditPage"));
const ListItemPage = lazy(() => import("../pages/item/ListPage"));
const CreateItemPage = lazy(() => import("../pages/item/CreatePage"));
const EditItemPage = lazy(() => import("../pages/set/EditPage"));
const ListSetPage = lazy(() => import("../pages/set/ListPage"));
const ListListPage = lazy(() => import("../pages/list/ListPage"));
const CreateListPage = lazy(() => import("../pages/list/CreatePage"));
const EditListPage = lazy(() => import("../pages/list/EditPage"));
const Login = lazy(() => import("../pages/Login"));
const Signin = lazy(() => import("../pages/Signin"));

interface Props {}
export const ApparatusRouter: FC<Props> = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Route
            exact
            path="/workspace_create"
            component={CreateWorkspacePage}
          />
          <Route exact path="/workspace_list" component={ListWorkspacePage} />
          <Route exact path="/workspace_edit" component={EditWorkspacePage} />
          <Route exact path="/item_list" component={ListItemPage} />
          <Route exact path="/item_create" component={CreateItemPage} />
          <Route exact path="/set_edit/:set_id" component={EditItemPage} />
          <Route exact path="/set_list" component={ListSetPage} />
          <Route exact path="/list_list" component={ListListPage} />
          <Route exact path="/list_create" component={CreateListPage} />
          <Route exact path="/list_edit/:list_id" component={EditListPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signin" component={Signin} />
        </Suspense>
        {/* <Route exact path="/sub" component={Sub} />
        <Route exact path="/pagination" component={Pagination} /> */}
      </Layout>
    </Router>
  );
};
