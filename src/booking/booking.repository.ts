import { Pool } from "pg";
import { Inject, Injectable } from "@nestjs/common";
import { Booking } from "./booking.types";

@Injectable()
export class BookingRepository{
    constructor(
        @Inject("PG_POOL")
        private readonly pool: Pool
    ){}

    async getBookings(): Promise<Booking[]> {
        const bookings = await this.pool.query<Booking>(`SELECT * FROM bookings`)
        return bookings.rows
    }

    async getBooking(id: number | string): Promise<Booking> {
        const booking = await this.pool.query<Booking>(`SELECT * FROM bookings WHERE id = $1`, [id])
        return booking.rows[0]
    }

    async getMyBookings(user_id: number | string): Promise<Booking[]> {
        const bookings = await this.pool.query<Booking>(`SELECT * FROM bookings WHERE user_id = $1`, [user_id])
        return bookings.rows
    }

    async createBooking(user_id: number | string, room_id: number | string, from: string, to: string): Promise<void> {
        await this.pool.query(`INSERT INTO bookings(user_id, room_id, start_at, end_at)
            VALUES($1, $2, $3, $4)`, [user_id, room_id, from, to])
    }

    async cancelBooking(id: number | string): Promise<void> {
        await this.pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [id])
    }
}