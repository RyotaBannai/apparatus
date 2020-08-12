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
  interface Item {
    id: number;
    id_on_server?: number | undefined;
    type?: string;
    data?: string;
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
    show: boolean;
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

  interface ListState {
    new: ApparatusList.List;
    edit: (ApparatusList.List & { id_on_server?: string })[];
  }

  type ListData = { id: string; targets: Addee.Addees } & List;
}

declare namespace Workspace {
  interface Workspace {
    name: string;
    description: string;
  }
  type WorkspaceOrUndefined = Workspace.Workspace | undefined;
  type Workspaces = Workspace.Workspace[];
}
