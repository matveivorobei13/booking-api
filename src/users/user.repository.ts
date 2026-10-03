import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { User, UserPublic } from "./user.types";
@Injectable()
export class UserRepository{
    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool,
    ) {}

    async getUsers(): Promise<UserPublic[]>{
        const users = await this.pool.query<UserPublic>(`SELECT name, id, email, created_at FROM users`)
        return users.rows
    }

    async getUser(id: number | string): Promise<User> {
        const user = await this.pool.query<User>(`SELECT * FROM users
            WHERE id = $1`, [id])
        return user.rows[0]
    }
}