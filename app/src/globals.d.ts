declare namespace Global {
  type RootState = import("./app/store").RootState;
  type AppDispatch = import("./app/store").AppDispatch;
  interface BasicKeyValueInput<K, V> {
    key: K;
    value: V;
  }
  type Mode = "new" | "edit";
}

declare namespace Item {
  type Item = {
    id: number;
    id_on_server?: number | undefined;
    type?: string;
    data?: string;
  } & Item.ItemMeta;

  interface ItemMeta {
    description?: string;
    note?: string;
  }

  type ItemOrUndefined = Item | undefined;

  type Items = Item[];
}

declare namespace ApparatusSet {
  interface Set {
    id: number;
    set_id_on_server?: number | null;
    name: string;
    items: Items;
    show?: boolean;
  }

  type SetOrUndefined = ApparatusSet | undefined;

  interface NewItemInput {
    set_id: number;
    set_id_on_server?: number | null;
    name?: string;
    item: Item & { update_data?: string };
    mode: Global.Mode;
  }

  type Sets = Array<ApparatusSet.Set | undefined>;

  interface InitialSets {
    new: ApparatusSet.Sets;
    edit: ApparatusSet.Sets;
  }

  interface Status {
    id: number;
    is_set: boolean;
  }
}

declare namespace Addee {
  type Addee = Item | Set;
  type Addees = Array<Item | Set>;
}

declare namespace ApparatusList {
  interface List {
    name: string;
    description?: string | null | undefined;
  }

  type Lists = ApparatusList.List[];

  type ListData = { id: string; targets: Addee.Addees } & List & {
      id_on_server?: string;
    };

  interface ListState {
    new: ApparatusList.List;
    edit: (ApparatusList.List & { id_on_server?: string })[];
  }

  interface ListHoverState {
    id: string;
    is_hover: boolean;
  }

  interface InitialListMeta {
    hover_states: ListHoverState[];
    editable: boolean;
    addable: {
      is_addable: boolean;
      add_from: "items" | "sets";
      targets: {
        items: Array<Item.Item & { item_meta: Item.ItemMeta }>;
        sets: ApparatusSet.Sets;
      };
      selected_targets: {
        items: number[];
        sets: number[];
      };
    };
  }

  type AddateListActionPayload = Partial<ApparatusList.List> & {
    id?: number;
    id_on_server?: string;
    mode: Global.Mode;
    targets?: Addee.Addees | Array<[]>;
  };

  interface UpdateSetInput {
    key: string;
    value: string;
  }

  interface Selectable {
    is_selectable: boolean;
    add?: ({ id, add_to }: { id: number; add_to: "items" | "sets" }) => void;
    remove?: ({ id, add_to }: { id: number; add_to: "items" | "sets" }) => void;
    selected?: { items: number[]; sets: number[] };
  }
}

declare namespace Folder {
  interface Folder {
    id: number;
    ownerID: number;
    name: string;
    description: string;
    created_at: string;
    parent?: Folder.Folder | null;
    children_folder?: Folder.Folder[] | null;
    lists?: Folder.List[];
  }

  interface Minimal {
    id: number;
    name: string;
  }

  interface List {
    id: string;
    name: string;
    description: string;
    __typename: string;
  }

  interface Selectable {
    is_selectable: boolean;
    add?: (id: string) => void;
    remove?: (id: string) => void;
    selected?: string[];
  }
}

declare namespace Workspace {
  interface Workspace {
    name: string;
    description: string;
  }
  type WorkspaceOrUndefined = Workspace.Workspace | undefined;
  type Workspaces = Workspace.Workspace[];
}
