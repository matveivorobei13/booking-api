import { UserService } from "./user.service";
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

@Controller("users")
export class UserController{
    constructor(private readonly userService: UserService){}

    @Get()
    async getUsers(){
        const users = await this.userService.getUsers()
        return {status: "ok", users: users}
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number){
        const user = await this.userService.getUser(id)
        return {status: 'ok', user: user}

    }
}