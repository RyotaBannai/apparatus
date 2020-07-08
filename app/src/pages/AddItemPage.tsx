import React from "react";
import { Add as ItemAdd } from "../components/Item/Add";

interface Props {}

export const AddItemPage: React.FC<Props> = () => {
  return (
    <div>
      <ItemAdd />
    </div>
  );
};
