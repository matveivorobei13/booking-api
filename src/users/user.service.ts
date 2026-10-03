import { UserRepository } from "./user.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User, UserPublic } from "./user.types";

@Injectable()
export class UserService{
    constructor(private readonly userRepository: UserRepository){}

    async getUsers(): Promise<UserPublic[]>{
        const users = await this.userRepository.getUsers()
        return users
    }

    async getUser(id: number | string): Promise<Omit<User, "password">>{
        const user = await this.userRepository.getUser(id)
        if(!user) throw new NotFoundException("user not found")
        const { password, ...UserWithoutPassword} = user
        return UserWithoutPassword
    }
}