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
  }

  type SetOrUndefined = ApparatusSet | undefined;

  interface NewItemInput {
    set_id: number;
    set_id_on_server?: number | null;
    name?: string;
    item: Item & { update_data?: string };
    edit_mode?: boolean | undefined;
  }

  type Sets = Array<ApparatusSet.Set | undefined>;

  interface Status {
    id: number;
    is_set: boolean;
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
