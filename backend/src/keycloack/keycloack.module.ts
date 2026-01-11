import { Module } from '@nestjs/common';
import { KeycloackController } from './keycloack.controller';
import { KeycloackService } from './keycloack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [KeycloackController],
  providers: [KeycloackService],
})
export class KeycloackModule {}
