import { Entity, Column } from "typeorm";
import { Base } from "./Base";

@Entity()
export class WordDefinition extends Base {
  @Column()
  word_id: number;

  @Column({
    default: "no definition",
  })
  definition: string;

  @Column({
    default: "noun",
  })
  pos: string;
}
