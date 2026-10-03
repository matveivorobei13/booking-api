import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '../shared/guards/auth.guards';
import type { Request } from 'express';
import { CreateBookingDto } from './booking.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService){}
    
    @Get()
    @UseGuards(AuthGuard)
    async getBookings(@Req() req: Request) {
        const bookings = await this.bookingService.getBookings(req.user)
        return {status: "ok", bookings: bookings}
    }
    
    @Get("my")
    @UseGuards(AuthGuard)
    async getMyBookings(@Req() req: Request) {
        const myBookings = await this.bookingService.getMyBookings(req.user.id)
        return {status: "ok", bookings: myBookings}
    }


    @Get(":id")
    async getBooking(@Param("id", ParseIntPipe) id: number) {
        const booking = await this.bookingService.getBooking(id)
        return {status: "ok", booking: booking}
    }

    @Post()
    @UseGuards(AuthGuard)
    async createBooking(@Body() data: CreateBookingDto, @Req() req: Request) {
        await this.bookingService.createBooking(data.roomId, req.user, data.from, data.to)
        return {status: "ok", message: "booking created"}
    }
    
    @Patch(":id")
    async cancelBooking(@Param("id", ParseIntPipe) id: number) {
        await this.bookingService.cancelBooking(id)
        return {status: "ok", message: "booking cancelled"}
    }
}
