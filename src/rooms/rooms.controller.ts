import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../shared/guards/auth.guards';
import { AvailabilityDto, CreateRoomDto, EditRoomDto } from './rooms.dto';
import type { Request } from 'express';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService){}

    @Get()
    async getRooms(){
        const rooms = await this.roomsService.getRooms()
        return {status: "ok", rooms: rooms}
    }
    @Get('availability')
    async getAvailableRooms(@Query() data: AvailabilityDto){
        const rooms = await this.roomsService.getAvailableRooms(data.from, data.to)
        return {status: "ok", rooms: rooms}
    }

    @Get(":id")
    async getRoom(@Param("id", ParseIntPipe) id: number){
        const room = await this.roomsService.getRoom(id)
        return {status: "ok", room: room}
    }

    @Post()
    @UseGuards(AuthGuard)
    async createRoom(@Body() data: CreateRoomDto, @Req() req: Request) {
        await this.roomsService.createRoom(data, req.user)
        return {status: "ok", message: "room created"}
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async deleteRoom(@Param("id", ParseIntPipe) id: number, @Req() req: Request){
        await this.roomsService.deleteRoom(id, req.user)
        return {status: "ok", message: "room delited"}
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    async editRoom(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Body() data: EditRoomDto){
        const newRoom = await this.roomsService.editRoom(data, req.user, id)
        return {status: "ok", newRoom: newRoom}
    }

    

}
