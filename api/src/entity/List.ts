import { Entity, Column, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { ItemData } from "../modules/item/TypeDefs";
import { Set } from "./Set";
import { AddeeUnion } from "./Addee";
import { AddeeList } from "./AddeeList";
import { ListFolder } from "./ListFolder";
import { ListWorkspace } from "./ListWorkspace";

@ObjectType()
@Entity()
export class List extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => AddeeUnion)
  targets: (ItemData | Set)[];

  @Field((type) => [AddeeList])
  @OneToMany((type) => AddeeList, (addee_list) => addee_list.list)
  addeeConnector: AddeeList[];

  @OneToOne((type) => ListFolder, (list_folder) => list_folder.list)
  folderConnector: ListFolder;

  @OneToOne((type) => ListWorkspace, (list_ws) => list_ws.list)
  wsConnector: ListWorkspace;
}
