import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { S_ADD_ITEMS } from "../../api/graphql/itemQueries";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import { BottomButtonSection } from "../../components/Parts/BottomButtonSection";
import { v4 as uuidv4 } from "uuid";

interface Props {}

const CreatePage: FC<Props> = () => {
  const dispatch = useDispatch();
  const { hiddenSets, removeShowFalse } = useSetActions();
  const { takeIdForSet, filterSet, getNewSets } = useSetHelpers;
  const sets = useSelector(getNewSets);
  const mode = "new";

  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    let id = takeIdForSet();
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        <ApparatusSet key={uuidv4()} id={id} mode={mode} />,
      ];
    } else {
      newChildren = [<ApparatusSet key={uuidv4()} id={id} mode={mode} />];
    }
    setChild(newChildren);
  };

  const handleOnAdd = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      callSetChild(children);
    },
    [children]
  );

  const [s_addItems, { loading: sa_loading, error: sa_error }] = useMutation(
    S_ADD_ITEMS,
    {
      onCompleted({ createItems: { res } }) {
        if (res === "Success") {
          dispatch(hiddenSets({ mode }));
          callSetChild(null);
          setOpen(!saveSnackBarOpen);
        } else {
          console.log(
            "Apollo mutation createItems response's status is unexpected."
          );
        }
      },
      onError(error: ApolloError) {
        console.log(error);
      },
    }
  );

  const sendItems = (e: SyntheticEvent) => {
    e.preventDefault();
    let jsoned_set = filterSet(sets);
    s_addItems({
      variables: { data: jsoned_set },
    });
  };

  useEffect(() => {
    if (sets.length > 0) {
      let old_sets: any[] = [];
      for (const set of sets) {
        if (set instanceof Object && "id" in set) {
          old_sets = [
            ...old_sets,
            <ApparatusSet {...set} key={uuidv4()} mode={mode} />,
          ];
        }
      }
      setChild(old_sets);
    } else {
      callSetChild(null);
    }

    return () => {
      dispatch(removeShowFalse());
    };
  }, []);

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Create New Item</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      {children.map((child) => child)}
      <BottomButtonSection
        nameAdd="Add Item"
        nameSave="Save Item"
        mode={mode}
        handleOnSave={sendItems}
        handleOnAdd={handleOnAdd}
      />
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { CreatePage as default };
