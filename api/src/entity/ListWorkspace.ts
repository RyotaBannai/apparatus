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
import { Workspace } from "./Workspace";

@ObjectType()
@Entity()
export class ListWorkspace {
  @Field()
  @PrimaryColumn()
  listId: number;

  @Field()
  @PrimaryColumn()
  wsId: number;

  @Field((type) => List)
  @OneToOne((type) => List, (list) => list.wsConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "listId" })
  list: List;

  @Field((type) => Workspace)
  @ManyToOne((type) => Workspace, (ws) => ws.listConnector)
  @JoinColumn({ name: "wsId" })
  ws: Workspace;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}
