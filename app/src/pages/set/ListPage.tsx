import React, { useEffect, FC } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import { S_GET_SETS } from "../../api/graphql/setQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import SetListTable from "../../components/Set/SetListTable";

interface Props {}

const ListPage: FC<Props> = () => {
  const { getCurrentWS } = useWSHelpers;
  const { loading: sg_loading, error: sg_error, data, refetch } = useQuery(
    S_GET_SETS,
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
      {data?.getSets.length > 0 ? (
        <div>
          <h2>Set List</h2>
          <SetListTable
            data={data?.getSets}
            selectable={{ is_selectable: false }}
          />
        </div>
      ) : (
        <div>No set</div>
      )}
    </>
  );
};

export { ListPage as default };
