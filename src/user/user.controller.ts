import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateuser.dto';


import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  @ApiOkResponse({type: UserEntity, isArray: true})
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: UserEntity})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
    // return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({type: UserEntity})
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto)
    // return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({type: UserEntity})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id)
    // return this.userService.remove(+id);
  }
}
