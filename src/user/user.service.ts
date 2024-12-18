import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Review } from '@prisma/client';
import { UpdateUserDto } from './dto/updateuser.dto';

// import { UserEntity } from './entities/user.entity';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) { }
    
    async isUser(userId:number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException("this user doesn't exist!!")
        } else {
            return user
        }
    }

    async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken
            }
        })
    }

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

    async findByEmail(email: string): Promise<User>{
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        // if (!user) {
        //     throw new UnauthorizedException("user doesn't exist!!!")
        // }

        return user
    }

    //*TODO: update findOneAuth to use findFirst
    // async findOneAuth(data: Partial<User>): Promise<User>{
    //     const user = await this.prisma.user.findFirst({
    //         where: {
    //             OR: [
    //                 { email: data.email },
    //                 { username: data.username }
    //             ]
    //         }
    //     })
    //     if (!user) {
    //         throw new UnauthorizedException("user couldn't be found!!")
    //     }

    //     return user
    // }

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
        

        //* add checker to check if username already exists?
        // console.log("email", createUserDto.email)
        const userExists = await this.findByEmail(createUserDto.email)

        if (userExists !== null) {
            throw new ConflictException("User Already Exits")
        }
        
        try {
            const salt = await bcrypt.genSalt()

            createUserDto.password = await bcrypt.hash(createUserDto.password, salt)
             const user = await this.prisma.user.create({
                data: createUserDto
            })
            delete user.password

            return user
        } catch (error) {
            throw new BadRequestException("User could not be created", error)
        }
       
    }


    findAll():Promise<User[]> {
        return this.prisma.user.findMany({})
    }


    async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
        //*TODO FIX THIS  UPDATE PROFILE MODEL NOT THE USER MODEL DIRECTLY
        const updateUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: updateUserDto
        })

        return updateUser
    }


    async deleteUser(id: number, userId: number) {
        const currentUser = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!currentUser) {
            throw new NotFoundException()
        }
        //compare Ids to make sure they match
        if (currentUser.id !== id) {
            throw new UnauthorizedException("You can't delete this user!!")
        }

        return await this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }




    //get user's upvoted reviwes by user
    async getUpvotedReviews(userId: number, /*skip: number = 0, take: number = 10*/): Promise<Review[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException("this user doesn't exist!!")
        }

        const upvotedReviews = this.prisma.review.findMany({
            where: {
                upvotedBy: {
                    some: { //!liable to be changed.
                        id: user.id
                    }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
            // skip: skip,
            // take: take
        })

        return upvotedReviews
    }


    //get user's downvoted reviews
    async getDownvotedReviews(userId: number): Promise<Review[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException("this user doesn't exist!!")
        }

        const downvotedReviews = this.prisma.review.findMany({
            where: {
                downvotedBy: {
                    some: { //!liable to be changed.
                        id: user.id
                    }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })

        return downvotedReviews
    }


    //get user bookmarks
    async getUserBookmarks(userId: number): Promise<Review[]>{
        //validate user
        await this.isUser(userId)

        const userBookmarks = this.prisma.review.findMany({
            where: {
                bookmarkedBy: {
                    some: {
                        id: userId
                    }
                }
            },
             include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })

        return userBookmarks

    }
}
