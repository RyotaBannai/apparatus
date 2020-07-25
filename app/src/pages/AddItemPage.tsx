import React from "react";
import { Add as ItemAdd } from "../components/Item/Add";
import { useApolloClient, gql } from "@apollo/client";
import * as _ from "lodash";

interface Props {}

const item_query = gql`
  query ItemQuery {
    items @client {
      id
      type
      data
    }
  }
`;

const set_query = gql`
  query SetQuery {
    sets @client {
      id
      items
    }
  }
`;

const resolvers = {
  Mutation: {
    deleteItem: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      const data = cache.readQuery({ item_query });
      let removed_item = _.remove(data.items, function(item: any) {
        return item.id == variables.id;
      });
      cache.writeQuery({
        item_query,
        data: { items: [...data.items] },
      });
      return null;
    },
    cleanItems: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      cache.writeQuery({
        item_query,
        data: { items: [] },
      });
      return null;
    },
  },
  Query: {
    getItemByID: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      const items = cache.readQuery({ item_query });
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
