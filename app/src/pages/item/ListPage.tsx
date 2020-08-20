import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_ITEMS } from "../../api/graphql/itemQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import ItemListTable from "../../components/Item/ItemListTable";

export function createData(
  id: number,
  type: string | undefined,
  data: string | undefined
): Item.Item {
  return {
    id,
    type,
    data,
  };
}

export const returnData = (items: Item.Items) => {
  let rows: ReturnType<typeof createData>[] = [];
  for (const { id, type, data } of items) {
    rows = [...rows, createData(id, type, data)];
  }
  return rows;
};

interface Props {}

const ListPage: FC<Props> = () => {
  const { getCurrentWS } = useWSHelpers;
  const { loading: sg_loading, error: sg_error, data, refetch } = useQuery(
    S_GET_ITEMS,
    {
      variables: {
        wsId: Number(getCurrentWS().id),
      },
      onError(error: ApolloError) {
        console.log(error);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <>
      {data?.getPureItems.length > 0 ? (
        <div>
          <h2>Item List</h2>
          <ItemListTable
            returnData={returnData}
            createData={createData}
            data={data?.getPureItems}
            selectable={{ is_selectable: false }}
          />
        </div>
      ) : (
        <div>No item</div>
      )}
    </>
  );
};

export { ListPage as default };
