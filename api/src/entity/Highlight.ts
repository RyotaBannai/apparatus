import { Entity, Column, OneToOne } from "typeorm";
import { Ctx, Field, ID, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { ItemMetaHighlight } from "./ItemMetaHighlight";

@ObjectType()
@Entity()
export class Highlight extends Base {
  @Column()
  @Field()
  targetType: string;

  @Column()
  @Field((type) => Number)
  start: number;

  @Column()
  @Field((type) => Number)
  end: number;

  @Field((type) => ItemMetaHighlight)
  @OneToOne(
    (type) => ItemMetaHighlight,
    (item_meta_highlight) => item_meta_highlight.itemMeta
  )
  itemMetaConnector: ItemMetaHighlight;
}
