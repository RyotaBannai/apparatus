import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";

interface Props {
  title: string;
}

const ITEM = gql`
  query Item($id: Float!) {
    getOneItem(id: $id) {
      id
      data
      type
      list {
        id
        name
      }
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UPDATE($id: Float!, $data: String) {
    updateItem(data: { id: $id, data: $data }) {
      id
      data
      type
      list {
        id
        name
      }
    }
  }
`;

export const Get: React.FC<Props> = ({ title }) => {
  let id = 1;
  let input: any = "";
  const { loading, error, data, refetch, networkStatus } = useQuery(ITEM, {
    notifyOnNetworkStatusChange: true, //  Includes information about refetching and polling status.
    variables: {
      id,
    },
    displayName: "Apollo component",
  });

  const [update] = useMutation(UPDATE_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <p> {JSON.stringify(data)} </p>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(input.value);
            update({ variables: { id: id, data: input.value } });
            input.value = "";
          }}
        >
          <input
            ref={(node) => {
              input = node;
            }}
          />
          <button type="submit">Update data</button>
        </form>
      </div>
    </div>
  );
};
