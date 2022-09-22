import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  BeforeInsert,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import bcrypt from 'bcryptjs';

import { Product } from './Product';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  email: string;

  @Column({})
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Product, product => product.user)
  products: Relation<Product>[];

  @BeforeInsert()
  private async cryptPasswordOnSave() {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  }

  async isCorrectPassword(candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}
