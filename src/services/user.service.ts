import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { User } from '../entity/User';
import { IUser } from '../models/interfaces';

import userRepository from '../repositories/user.repository';

export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = userRepository;
  }

  private _singToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async login(email: string, password: string) {
    // If no user with this email the response will be 404
    const user = await this.userRepository.findOneByOrFail({ email });

    const correctPassword = await user.isCorrectPassword(
      password,
      user.password
    );

    if (!correctPassword) throw new Error('Invaild data');
    // Exculde password from response
    delete user.password;

    const token = this._singToken(user.id);
    return { user, token };
  }

  async signup(user: IUser) {
    const newUser = new User();
    newUser.id = user.id;
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.password = user.password;

    const savedUser = await this.userRepository.save(newUser);
    // Exculde password from response
    delete savedUser.password;

    const token = this._singToken(user.id);

    return { user: savedUser, token };
  }
}
