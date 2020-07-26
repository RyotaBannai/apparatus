import React from "react";
import { Add as ItemAdd } from "../components/Item/Add";
import { useApolloClient, gql } from "@apollo/client";
import * as _ from "lodash";

interface Props {}

export const AddItemPage: React.FC<Props> = () => {
  return (
    <div>
      <ItemAdd />
    </div>
  );
};
