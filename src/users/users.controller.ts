import { Body, Controller, Post, BadRequestException, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './users.dto';
import { Roles } from 'src/common/roles/roles.decorator';
import { RolesGuard } from 'src/common/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() userData: CreateUserDto) {
    try {
      // Validate user input
      const { error } = CreateUserSchema.validate(userData);
      if (error) {
        throw new BadRequestException(error.details[0].message);
      }

      return this.usersService.createUser(userData);
    } catch (error) {
      throw new BadRequestException('Signup failed: ' + error.message);
    }
  }
  @Get()
  @Roles('manager') 
  @UseGuards(RolesGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
