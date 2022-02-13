import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from 'database/entities/user.entity';
import { passwordHashing } from 'utils/passwordHashing.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  USER_NOT_FOUND,
  USER_WITH_THIS_EMAIL_DOES_NOT_EXIST,
} from 'constants/api';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      USER_WITH_THIS_EMAIL_DOES_NOT_EXIST,
      HttpStatus.NOT_FOUND,
    );
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      USER_WITH_THIS_EMAIL_DOES_NOT_EXIST,
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await passwordHashing(password);
      updateUserDto.password = hashedPassword;
    }
    await this.userRepository.update(id, updateUserDto);
    const user = this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async updateImage(id: number, imageUrl: string) {
    await this.userRepository.update(id, { image: imageUrl });
    const user = this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
