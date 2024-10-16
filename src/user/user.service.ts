import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/updateuser.dto';
import { UserEntity } from './entities/user.entity';


@Injectable()
export class UserService {
    constructor(
        // @InjectRepository(User)
    //   private userRepo: Repository<User>,
      private prisma: PrismaService
    ){}

    async findOneAuth(data: Partial<User>): Promise<User>{
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

    async findOne(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) { //* just to note. this might be tots unnecessary
            throw new UnauthorizedException("user couldn't be found!!")
        }

        return user
    }
    
    
    //user signup
    async createUser(createUserDto: CreateUserDto): Promise<User> { //Data Transfer Object
        const salt = await bcrypt.genSalt()

        createUserDto.password = await bcrypt.hash(createUserDto.password, salt)
        try {
             const user = await this.prisma.user.create({
                data: createUserDto
            })
            delete user.password
            return user
        } catch (error) {
            console.log(error)
            throw new BadRequestException("User could not be created")
        }
       
    }


    findAll():Promise<User[]> {
        return this.prisma.user.findMany({})
    }


    async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
        //*TODO FIX THIS  UPDATE MODEL NOT THE USER MODEL DIRECTLY
        const updateUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: updateUserDto
        })

        return updateUser
    }


    async deleteUser(userId: number) {
        return await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }
}
