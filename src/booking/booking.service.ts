import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { Booking } from './booking.types';
import { UserPayload } from '../users/user.types';
import { RoomsRepository } from '../rooms/rooms.repository';

@Injectable()
export class BookingService {
    constructor(
        private readonly bookingsRepository: BookingRepository,
        private readonly roomsRepository: RoomsRepository
    ){}

    async getBookings(user: UserPayload): Promise<Booking[]>{
        if(user.role !== "admin") throw new ForbiddenException("Insufficient permissions")
        const bookings = await this.bookingsRepository.getBookings()
        return bookings
    }

    async getBooking(id: number | string): Promise<Booking>{
        const booking = await this.bookingsRepository.getBooking(id)
        if(!booking) throw new NotFoundException("booking not found")
        return booking
    }

    async getMyBookings(user_id: number | string): Promise<Booking[]>{
        const bookings = await this.bookingsRepository.getMyBookings(user_id)
        return bookings
    }

    async createBooking(room_id: number | string, user: UserPayload, from: string, to: string): Promise<void> {
        if(new Date(from) >= new Date(to) || new Date() > new Date(from)) throw new BadRequestException("incorrect data")
        const room = await this.roomsRepository.getRoom(room_id)
        if(!room) throw new NotFoundException("room not found")
        
        const isAvailable = await this.roomsRepository.getAvailableRoomsById(from, to, room_id)
        if(isAvailable) throw new ConflictException("room isnt available")

        await this.bookingsRepository.createBooking(user.id, room_id, from, to)
    }

    async cancelBooking(booking_id: number | string): Promise<void>{
        const booking = await this.bookingsRepository.getBooking(booking_id)
        if(!booking) throw new NotFoundException("booking not found")

        await this.bookingsRepository.cancelBooking(booking_id)
    }
}
