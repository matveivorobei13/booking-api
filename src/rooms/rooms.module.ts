import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository';
import { SharedModule } from '../shared/shared.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [SharedModule, DatabaseModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
  exports: [RoomsRepository]
})
export class RoomsModule {}
