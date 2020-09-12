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
import { Item } from "./Item";
import { Workspace } from "./Workspace";

@ObjectType()
@Entity()
export class ItemWorkspace {
  @Field()
  @PrimaryColumn()
  itemId: number;

  @Field()
  @PrimaryColumn()
  wsId: number;

  @Field((type) => Item)
  @OneToOne((type) => Item, (item) => item.wsConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Field((type) => Workspace)
  @ManyToOne((type) => Workspace, (ws) => ws.itemConnector, {
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
