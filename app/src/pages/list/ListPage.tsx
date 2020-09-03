import React, { useEffect, FC } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import { S_GET_LISTS } from "../../api/graphql/listQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import ListEditPageTable from "../../components/List/ListEditPageTable";

interface Props {}

const ListPage: FC<Props> = () => {
  const { getCurrentWS } = useWSHelpers;
  const { data, refetch } = useQuery(S_GET_LISTS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const selectable: Folder.Selectable = {
    is_selectable: false,
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      {data?.getLists.length > 0 ? (
        <div>
          <h2>Lists</h2>
          <ListEditPageTable data={data.getLists} selectable={selectable} />
        </div>
      ) : (
        <div>No list found</div>
      )}
    </>
  );
};

export { ListPage as default };
