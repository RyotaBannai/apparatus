import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";

interface Props {}
const FolderPage: FC<Props> = () => {
  const dispatch = useDispatch();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const { getCurrentWS } = useWSHelpers;
  let { folder_id } = useParams<{ folder_id?: string }>();

  useEffect(() => {}, [folder_id]);

  // const [s_createList, { loading: sa_loading, error: sa_error }] = useMutation(
  //   S_CREATE_LIST,
  //   {
  //     onCompleted({ createList }) {
  //       setOpen(!saveSnackBarOpen);
  //     },
  //     onError(error: ApolloError) {
  //       console.log(error);
  //     },
  //   }
  // );

  // if (sa_loading) return <p>Loading...</p>;
  // if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { FolderPage as default };
