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
import { Workspace } from "./Workspace";
import { Folder } from "./Folder";

@ObjectType()
@Entity()
export class FolderWorkspace {
  @Field()
  @PrimaryColumn()
  folderId: number;

  @Field()
  @PrimaryColumn()
  wsId: number;

  @Field((type) => Folder)
  @OneToOne((type) => Folder, (folder) => folder.wsConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "folderId" })
  folder: Folder;

  @Field((type) => Workspace)
  @ManyToOne((type) => Workspace, (ws) => ws.listConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "wsId" })
  ws: Workspace;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}
