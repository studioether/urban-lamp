import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get("all")
    findAll() {
        return this.userService.findAll()
    }


    // @Post("new")
    // create(@Param("name") name: string) {
    //     return name
    // }
    // @Post("new")
    // create(@Body() data: string) {
    //     return name
    // }
}
