import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { authRepository } from "./auth.repository";
import { User } from "../users/user.types";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt"
import { Register } from "./auth.types";
import { UserRepository } from "../users/user.repository";


@Injectable()
export class AuthService{
    constructor(
        private readonly authRepository: authRepository,
        private readonly userRepository: UserRepository,
    ){}

    async register(name: string, password_data: string, email: string): Promise<Register>{
        const sameUsers = await this.authRepository.getUserByNameOrEmail(name, email)
        if(sameUsers.length !== 0){
            if(sameUsers[0].name === name) throw new ConflictException("this name already exist")
            if(sameUsers[0].email === email) throw new ConflictException("this email already exist")
        }
        const hash = await bcrypt.hash(password_data, 10)
        const user = await this.authRepository.createUser(name, hash, email)

        const access = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: "15m"})
        const refresh = crypto.randomBytes(40).toString("hex")
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.CreateRefreshToken(user.id, refresh, expiresAt)

        const { password, ...userWithoutPassword } = user
        return { user: userWithoutPassword, access, refresh}
         
    }

    async login(name: string, password_data: string): Promise<Register> {
        const users = await this.authRepository.getUserByName(name)
        
        let hash: string

        if(users.length === 0) hash = process.env.FAKE_HASH as string
        else hash = users[0].password

        const result = await bcrypt.compare(password_data, hash)
        if(!result) throw new UnauthorizedException("incorrect data")
        
        const access = jwt.sign({id: users[0].id, role: users[0].role}, process.env.JWT_SECRET as string, {expiresIn: "15m"})
        const refresh = crypto.randomBytes(40).toString("hex")

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.CreateRefreshToken(users[0].id, refresh, expiresAt)
        const { password, ...userWithoutPassword } = users[0]
        return { user: userWithoutPassword, access, refresh}
    }

    async me(id: string | number): Promise<Omit<User, "password"> | undefined> {
        const user = await this.userRepository.getUser(id)
        if(!user) throw new NotFoundException("user not found")
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    async refresh(oldToken: string): Promise<Omit<Register, "user">>{
        const refreshToken = await this.authRepository.findRefreshToken(oldToken)

        if(!refreshToken) throw new UnauthorizedException("unauthorized")
        
        if(new Date(refreshToken.expires_at) < new Date()) {
            await this.authRepository.deleteRefreshToken(refreshToken.id)
            throw new UnauthorizedException("unauthorized")
        }

        await this.authRepository.deleteRefreshToken(refreshToken.id)
        const user = await this.userRepository.getUser(refreshToken.user_id)
        const access = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: "15m"})
        const refresh = crypto.randomBytes(40).toString("hex")

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.CreateRefreshToken(user.id, refresh, expiresAt)

        return {access, refresh}

        }

    async logOut(token: string): Promise<void> {
        const oldToken = await this.authRepository.findRefreshToken(token)
        if(!oldToken) return
        await this.authRepository.deleteRefreshToken(oldToken.id)
        return
    }
}