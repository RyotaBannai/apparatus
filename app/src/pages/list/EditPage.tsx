import React, { useState, useEffect, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_LIST, S_DELETE_LIST } from "../../api/graphql/listQueries";
import { S_GET_SETS } from "../../api/graphql/setQueries";
import { S_GET_ITEMS } from "../../api/graphql/itemQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import ListEditPageTitleSection from "../../components/List/ListEditPageTitleSection";
import ListEditPageAddSection from "../../components/List/ListEditPageAddSection";
import ListEditPageListTargets from "../../components/List/ListEditPageListTargets";
import { ListEditPageDeleteListSection } from "../../components/List/ListEditPageDeleteSection";
import { ListEditPopover } from "../../components/List/ListEditPopover";
import {
  highlightText,
  unHighlightText,
  proceedHighlightText,
} from "../../components/List/service";

interface Props {}

const EditPage: FC<Props> = () => {
  const [deletable, setDeletable] = useState(false);
  const [addable, setAddable] = useState(false);
  const [saveSnackBarOpen, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Range | undefined>();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  }>();
  const dispatch = useDispatch();
  const { updateAddableTargets } = useListMetaActions();
  let { list_id } = useParams<{ list_id?: string }>();
  const history = useHistory();
  const { getAddableTargets, getAddableSelected } = useListHelpers;
  const targets = useSelector(getAddableTargets);
  const selected = useSelector(getAddableSelected);

  const toggleDeletableHandler = useCallback(() => setDeletable(!deletable), [
    deletable,
  ]);

  const toggleAddableHandler = useCallback(() => setAddable(!addable), [
    addable,
  ]);

  const {
    loading: sg_loading,
    error: sg_error,
    refetch: refetchList,
    data: list,
  } = useQuery(S_GET_LIST, {
    variables: {
      id: String(list_id),
    },
    onCompleted({ getList }) {},
  });

  const [s_deleteList] = useMutation(S_DELETE_LIST, {
    onCompleted({ deleteFolder }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const deleteList = useCallback(async () => {
    await s_deleteList({
      variables: {
        id: list?.getList.id,
      },
    });
    history.push(`/list_list`);
  }, [list]);

  let callSnackBarOpenHandler = useCallback(() => setOpen(!saveSnackBarOpen), [
    saveSnackBarOpen,
  ]);

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

  const handleClose = () => {
    setPopoverOpen(false);
    setSelectedRange(undefined);
  };

  const onHighlightHandler = () => {
    highlightText(selectedRange!);
    handleClose();
  };

  const onUnhighlightHander = () => {
    unHighlightText(selectedRange!);
    handleClose();
  };

  const onMouseUpHandler = (): void | undefined => {
    const range = proceedHighlightText();
    if (range === undefined) return;
    const { top, left, width } = range?.getBoundingClientRect()!;
    setPopoverPosition({ top, left: left + width });
    setSelectedRange(range);
    setPopoverOpen(true);
  };

  useEffect(() => {
    refetchList();
  }, [list]);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      {/* <pre>{JSON.stringify(this_list, null, 1)}</pre> */}
      <ListEditPageTitleSection
        data={list?.getList}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
        deleteList={deleteList}
        is_deletable={deletable}
        is_addable={addable}
        toggleDeletableHandler={toggleDeletableHandler}
        toggleAddableHandler={toggleAddableHandler}
        refetchList={refetchList}
      />
      <ListEditPageAddSection
        is_addable={addable}
        list_id={list_id}
        selected={selected}
        targets={targets}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
        refetchList={refetchList}
      />
      <ListEditPageDeleteListSection
        is_deletable={deletable}
        list_id={list?.getList.id}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
        refetchList={refetchList}
      />
      <ListEditPageListTargets
        is_deletable={deletable}
        targets={list?.getList.targets}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
        onMouseUpHandler={onMouseUpHandler}
      />
      <ListEditPopover
        open={popoverOpen}
        top={popoverPosition?.top}
        left={popoverPosition?.left}
        onClose={handleClose}
        onHighlightHandler={onHighlightHandler}
        onUnhighlightHander={onUnhighlightHander}
      />
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
