import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class UserMeta {
  // Add if:
  //  you want to fetch userId as well. if you don't add this you can't get this from relations option.
  //  you want to use userId when you narrow down with where method. typeorm creates userId anyways, but you can't use them for query.
  @PrimaryColumn()
  userId: number;

  @OneToOne((type) => User, (user) => user.user_meta, { primary: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @OneToMany((type) => Item, (item) => item.user_meta)
  item: Item[];

  @UpdateDateColumn()
  updated_at: string;

  @CreateDateColumn()
  created_at: string;
}
