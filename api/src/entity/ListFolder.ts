import {
  Entity,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { List } from "./List";
import { Folder } from "./Folder";

@ObjectType()
@Entity()
export class ListFolder {
  @Field()
  @PrimaryColumn()
  listId: number;

  @Field()
  @PrimaryColumn()
  folderId: number;

  @Field((type) => List)
  @OneToOne((type) => List, (list) => list.folderConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "listId" })
  list: List;

  @Field((type) => Folder)
  @ManyToOne((type) => Folder, (folder) => folder.listConnector)
  @JoinColumn({ name: "folderId" })
  folder: Folder;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}
