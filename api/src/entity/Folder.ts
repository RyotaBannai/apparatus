import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { List } from "./List";
import { ListFolder } from "./ListFolder";
import { FolderWorkspace } from "./FolderWorkspace";

@ObjectType()
@Entity()
@Tree("closure-table")
export class Folder extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;

  @TreeChildren()
  children: Folder[];

  @TreeParent()
  parent: Folder;

  @Field((type) => [Folder], { nullable: true })
  children_folder: Folder[];

  @Field((type) => String, { nullable: true })
  parent_folder: string;

  @Field((type) => [List])
  lists: List[];

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => [ListFolder])
  @OneToMany((type) => ListFolder, (list_folder) => list_folder.folder)
  listConnector: ListFolder[];

  @OneToOne((type) => FolderWorkspace, (folder_ws) => folder_ws.folder)
  wsConnector: FolderWorkspace;
}
