import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  price: number;

  @DeleteDateColumn()
  isDeleted: Date;

  @ManyToOne(() => User, user => user.products)
  user: Relation<User>;
}
