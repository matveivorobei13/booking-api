import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DatabaseModule } from '../database/database.module';
import { SharedModule } from '../shared/shared.module';
import { BookingRepository } from './booking.repository';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [DatabaseModule, SharedModule, RoomsModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository]
})
export class BookingModule {}
