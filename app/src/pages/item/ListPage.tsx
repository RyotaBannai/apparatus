import React, { useEffect, FC } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import { S_GET_ITEMS } from "../../api/graphql/itemQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import ItemListTable from "../../components/Item/ItemListTable";

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
  }, [refetch]);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <>
      {data?.getPureItems.length > 0 ? (
        <div>
          <ItemListTable
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
