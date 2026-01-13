import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KeycloackService } from './keycloack.service';
import { LoginDto, RegisterDto, CreateRoleDto, AssignRoleDto } from './dto';

@Controller('keycloack')
export class KeycloackController {
  constructor(private readonly keycloackService: KeycloackService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.keycloackService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.keycloackService.register(registerDto);
  }

  @Post('roles')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.keycloackService.createRole(createRoleDto);
  }

  @Post('roles/assign')
  @UsePipes(new ValidationPipe({ transform: true }))
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.keycloackService.assignRole(assignRoleDto);
  }
}
