import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloackModule } from './keycloack/keycloack.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [KeycloackModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
