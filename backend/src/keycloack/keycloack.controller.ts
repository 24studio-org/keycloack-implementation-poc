import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KeycloackService } from './keycloack.service';
import { LoginDto, RegisterDto } from './dto';

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
}
