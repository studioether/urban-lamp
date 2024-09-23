import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async findOne(data: Partial<User>): Promise<User>{
        const user = await this.userRepo.findOneBy({email: data.email})
        if (!user) {
            throw new UnauthorizedException("user couldn't be found!!")
        }

        return user
    }
    
    
    //user signup
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt()

        createUserDto.password = await bcrypt.hash(createUserDto.password, salt)
        const user = await this.userRepo.save(createUserDto)
        delete user.password
        return user
    }
}
