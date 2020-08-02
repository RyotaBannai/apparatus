import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Set } from "./Set";
import { Workspace } from "./Workspace";

@ObjectType()
@Entity()
export class SetWorkspace {
  @Field()
  @PrimaryColumn()
  setId: number;

  @Field()
  @PrimaryColumn()
  wsId: number;

  @Field((type) => Set)
  @ManyToOne((type) => Set, (set) => set.wsConnector)
  @JoinColumn({ name: "setId" })
  set: Set;

  @Field((type) => Workspace)
  @ManyToOne((type) => Workspace, (ws) => ws.itemConnector)
  @JoinColumn({ name: "wsId" })
  ws: Workspace;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}
