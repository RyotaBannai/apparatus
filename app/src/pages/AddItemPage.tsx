import React from "react";
import { Add as ItemAdd } from "../components/Item/Add";
import { useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import * as _ from "lodash";

interface Props {}

const query = gql`
  query ItemQuery {
    items @client {
      id
      type
      data
    }
  }
`;

const resolvers = {
  Mutation: {
    addItem: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      const data = cache.readQuery({ query });
      let this_item = _.find(data.items, { id: variables.id });
      if (this_item === undefined) {
        let newItem = {
          id: variables.id,
          type: variables.data ?? "", // null or undefined
          data: variables.data ?? "",
          __typename: "Item",
        };
        cache.writeQuery({
          query,
          data: { items: [...data.items, newItem] },
        });
      } else {
        let newItem;
        if (variables.update_data === "type") {
          newItem = { ...this_item, type: variables.type };
        } else {
          newItem = { ...this_item, data: variables.data };
        }
        let removed_item = _.remove(data.items, function(item: any) {
          return item.id == variables.id;
        });
        cache.writeQuery({
          query,
          data: { items: [...data.items, newItem] },
        });
      }
      return null;
    },
  },
  Query: {
    getItemByID: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      const items = cache.readQuery({ query });
      return items.map((item: any) => item.id === variables.id);
    },
  },
};

export const AddItemPage: React.FC<Props> = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);
  return (
    <div>
      <ItemAdd />
    </div>
  );
};
