import React, { useState, useEffect, useCallback, FC } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { S_GET_LIST } from "../../api/graphql/listQueries";
import { S_GET_SETS } from "../../api/graphql/setQueries";
import { S_GET_ITEMS } from "../../api/graphql/itemQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import ListEditPageTopName from "../../components/List/ListEditPageTopName";
import ListEditPageAddSection from "../../components/List/ListEditPageAddSection";
import ListEditPageListTargets from "../../components/List/ListEditPageListTargets";

interface Props {}

const EditPage: FC<Props> = () => {
  const [saveSnackBarOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  const { addateHoverState, updateAddableTargets } = useListMetaActions();
  let { list_id } = useParams<{ list_id?: string }>();

  const {
    getEditLists,
    getListByKey,
    getListMeta,
    getHoverStateById,
    takeIdForList,
    getAddableTargets,
    getAddableSelected,
  } = useListHelpers;

  const this_list = getListByKey(useSelector(getEditLists), {
    key_name: "id_on_server",
    key: list_id,
  });

  const list_meta = useSelector(getListMeta);
  const targets = useSelector(getAddableTargets);
  const selected = useSelector(getAddableSelected);

  const [
    fetchList,
    { loading: sg_loading, error: sg_error, data },
  ] = useLazyQuery(S_GET_LIST, {
    variables: {
      id: String(list_id),
    },
    onCompleted({ getList }) {
      const { id, description, name, targets } = getList;
      dispatch(
        addateList({
          id: takeIdForList(),
          id_on_server: id,
          description,
          name,
          targets,
          mode: "edit",
        })
      );
    },
  });

  let callSnackBarOpenHandler = useCallback(() => setOpen(!saveSnackBarOpen), [
    saveSnackBarOpen,
  ]);

  const getHoverStateByIdHandler = (id: string) =>
    getHoverStateById(list_meta.hover_states, { id });

  const changeHoverState = ({ id, is_hover }: ApparatusList.ListHoverState) =>
    dispatch(
      addateHoverState({
        id,
        is_hover,
      })
    );

  const { getCurrentWS } = useWSHelpers;
  const { data: sets } = useQuery(S_GET_SETS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onCompleted({ getSets }) {
      dispatch(updateAddableTargets({ targets: getSets }));
    },
  });

  const { data: items } = useQuery(S_GET_ITEMS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onCompleted({ getPureItems }) {
      dispatch(updateAddableTargets({ targets: getPureItems }));
    },
  });

  useEffect(() => {
    if (this_list === undefined) {
      fetchList();
    }

    changeHoverState({
      id: "list_title",
      is_hover: false,
    });
  }, []);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      {/* <pre>{JSON.stringify(this_list, null, 1)}</pre> */}
      <ListEditPageTopName
        this_list={this_list}
        data={data}
        getHoverStateByIdHandler={getHoverStateByIdHandler}
        changeHoverState={changeHoverState}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
      />
      <ListEditPageAddSection
        list_id={list_id}
        selected={selected}
        targets={targets}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
      />
      <ListEditPageListTargets
        targets={this_list?.targets}
        getHoverStateByIdHandler={getHoverStateByIdHandler}
        changeHoverState={changeHoverState}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
      />
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
