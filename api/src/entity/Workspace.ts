import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";
import { ItemWorkspace } from "./ItemWorkspace";

@ObjectType()
@Entity()
export class Workspace extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => [ItemWorkspace])
  @OneToMany((type) => ItemWorkspace, (item_ws) => item_ws.ws)
  @JoinColumn()
  itemConnector: ItemWorkspace[];
}

@InputType({ description: "New WS data" })
export class createWSInput implements Partial<Workspace> {
  @Field((type) => String, { nullable: false })
  name: string;
  @Field((type) => String, { nullable: false })
  description: string;
}

@InputType({ description: "Edit WS" })
export class editWSInput extends createWSInput {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getWSbyIDArgs {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getWSArgs implements Partial<Workspace> {
  @Field((type) => ID, { nullable: false })
  ownerId: number;
}
