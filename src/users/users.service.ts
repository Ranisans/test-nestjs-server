import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from 'database/entities/user.entity';
import { passwordHashing } from 'utils/passwordHashing.util';
import { generatePDF } from './logic/pdfGenerator.logic';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  USER_HAS_NO_PDF_FILE,
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

  async findById(id: string | number) {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;

    // if param is part of the address, not user id
    if (!userId) {
      throw new NotFoundException();
    }

    const user = await this.userRepository.findOne(userId);
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

  async generatePDF(email: string) {
    // if a user with this email - this.findByEmail will throw the USER_NOT_FOUND error
    const user = await this.findByEmail(email);
    const { firstName, lastName, image } = user;

    if (!image) {
      return { result: false };
    }

    try {
      const result = await generatePDF({
        firstName,
        lastName,
        image,
      });

      this.userRepository.update(user.id, { pdfFile: result });
    } catch (error) {
      return { result: false };
    }
    return { result: true };
  }

  async getPdf(email: string) {
    // if a user with this email - this.findByEmail will throw the USER_NOT_FOUND error
    const user = await this.findByEmail(email);

    const { pdfFile } = user;

    if (pdfFile) {
      return pdfFile;
    }
    throw new HttpException(USER_HAS_NO_PDF_FILE, HttpStatus.BAD_REQUEST);
  }
}
