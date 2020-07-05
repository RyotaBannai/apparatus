import {
  Entity,
  Column,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Base } from "./Base";

/*
{
	"name":"astronomy",
	"description":"relative to science", 
	"parent_id": 2
}
*/

@Entity()
@Tree("closure-table")
export class Folder extends Base {
  @Column()
  name: string;

  @Column("text")
  description: string;

  @TreeChildren()
  children: Folder[];

  @TreeParent()
  parent: Folder;
}
