import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { Room } from './rooms.types';
import { CreateRoomDto, EditRoomDto } from './rooms.dto';
import { UserPayload } from '../users/user.types';

@Injectable()
export class RoomsService {
    constructor(private readonly roomsRepository: RoomsRepository){}

    async getRooms(): Promise<Pick<Room, "id" | "name">[]>{
        const rooms = await this.roomsRepository.getRooms()
        return rooms
    }

    async getRoom(id: number | string): Promise<Room> {
        const room = await this.roomsRepository.getRoom(id)
        if(!room) throw new NotFoundException("room not found")

        return room
    }

    async createRoom(data: CreateRoomDto, user: UserPayload): Promise<void>{
        if(user.role !== "admin") throw new ForbiddenException("Insufficient permissions")
        await this.roomsRepository.createRoom(data.name, data.capacity, data.price)
    }

    async deleteRoom(id: number | string, user: UserPayload): Promise<void>{
        if(user.role !== "admin") throw new ForbiddenException("Insufficient permissions")
        const room = await this.getRoom(id)
        if(!room) throw new NotFoundException("room not found")

        await this.roomsRepository.deleteRoom(id)

    }

    async editRoom(data: EditRoomDto, user: UserPayload, id: number | string): Promise<Room> {
        if(user.role !== "admin") throw new ForbiddenException("Insufficient permissions")
        if (Object.values(data).every(value => value === undefined)) {
            throw new BadRequestException('At least one field is required');
        }

        const room = await this.getRoom(id)
        if(!room) throw new NotFoundException("room not found")

        const newRoom = await this.roomsRepository.editRoom(id, data)

        return newRoom
    }

    async getAvailableRooms(from: string, to: string): Promise<Room[]> {
        if(new Date(from) >= new Date(to)) throw new BadRequestException("incorrect data")
        const rooms = await this.roomsRepository.getAvailableRooms(from ,to)
        return rooms
    }
}
