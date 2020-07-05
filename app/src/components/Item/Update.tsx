import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";

interface Props {
  title: string;
}

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

export const Update: React.FC<Props> = ({ title }) => {
  let id = 1;
  let input: any = "";

  const [update] = useMutation(UPDATE_ITEM);

  return (
    <div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
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
