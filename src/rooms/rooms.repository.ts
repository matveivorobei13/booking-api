import { Pool } from "pg";
import { Inject, Injectable } from "@nestjs/common";
import { Room } from "./rooms.types";
import { EditRoomDto } from "./rooms.dto";

@Injectable()
export class RoomsRepository{
    constructor(
        @Inject("PG_POOL")
        private readonly pool: Pool
    ){}

    async createRoom(name: string, capacity: number, price: number): Promise<void> {
        await this.pool.query(`INSERT INTO rooms (name, price, capacity)
            VALUES($1, $2, $3)`, [name, price, capacity])
    }

    async getRooms(): Promise<Pick<Room, "id" | "name">[]> {
        const rooms = await this.pool.query<Pick<Room, "id" | "name">>(`SELECT name, id FROM rooms`)
        return rooms.rows
    }

    async getRoom(id: number | string): Promise<Room> {
        const rooms = await this.pool.query<Room>(`SELECT * FROM rooms WHERE id = $1`, [id])
        return rooms.rows[0]
    }

    async editRoom(id: number | string, data: EditRoomDto): Promise<Room>{
        const values: unknown[] = [id]
        const keys: string[] = []

        Object.entries(data).forEach(([key, value]) => {
            if(value){
                keys.push(`${key} = $${values.length + 1}`);
                values.push(value);
            }
        });

        const query = `UPDATE rooms SET ${keys.join(",")} WHERE id = $1 RETURNING *`

        const newRoom = await this.pool.query<Room>(query, values)
        return newRoom.rows[0]
    }

    async deleteRoom(id: number | string): Promise<void> {
        await this.pool.query(`DELETE FROM rooms WHERE id = $1`, [id])
    }

    async getAvailableRooms(from: string, to: string): Promise<Room[]>{
        const rooms = await this.pool.query<Room>(
        `
        SELECT
        r.name,
        r.id,
        r.price,
        r.capacity,
        r.created_at
        FROM rooms r
        WHERE NOT EXISTS (
        SELECT 1
        FROM bookings b
        WHERE b.room_id = r.id
        AND b.status = 'active'
        AND b.start_at < $2
        AND b.end_at > $1);`,
        [from, to]
);

        return rooms.rows
    }
    async getAvailableRoomsById(from: string, to: string, room_id: number | string): Promise<Room>{
        const rooms = await this.pool.query<Room>(
        `
            SELECT r.name, r.id, r.price, r.capacity, r.created_at
            FROM rooms r
            JOIN bookings b ON r.id = b.room_id
            WHERE b.status = 'active'
            AND b.start_at < $2
            AND b.end_at > $1
            AND r.id = $3
        `,
        [from, to, room_id],
        );

        return rooms.rows[0]
    }
}