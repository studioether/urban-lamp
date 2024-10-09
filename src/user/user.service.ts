import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User} from '@prisma/client';


@Injectable()
export class UserService {
    constructor(
        // @InjectRepository(User)
    //   private userRepo: Repository<User>,
      
      private prisma: PrismaService
    ){}

    async findOne(data: Partial<User>): Promise<User>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) {
            throw new UnauthorizedException("user couldn't be found!!")
        }

        return user
    }
    
    
    //user signup
    async createUser(createUserDto: CreateUserDto): Promise<User> { //Data Transfer Object
        const salt = await bcrypt.genSalt()

        createUserDto.password = await bcrypt.hash(createUserDto.password, salt)
        const user = await this.prisma.user.create({
            data: createUserDto
        })
        delete user.password
        return user
    }


    findAll() {
        return "found all users"
    }


    async updateProfile () {}
}
