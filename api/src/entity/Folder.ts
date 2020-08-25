import {
  Entity,
  Column,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./Base";
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

  @Field((type) => Folder, { nullable: true })
  parent_folder: Folder;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @OneToOne((type) => FolderWorkspace, (folder_ws) => folder_ws.folder)
  wsConnector: FolderWorkspace;
}
