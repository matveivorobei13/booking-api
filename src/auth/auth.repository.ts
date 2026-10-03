import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { User } from "../users/user.types";
import { RefreshToken } from "./auth.types";

@Injectable()
export class authRepository{
    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ){}

    async createUser(name: string, password: string, email: string): Promise<User> {
        const user = await this.pool.query<User>(`INSERT INTO users(name, password, email)
            VALUES($1, $2, $3) RETURNING *`, [name, password, email])

        return user.rows[0]
    }

    async getUserByNameOrEmail(name: string, email: string): Promise<User[]> {
        const users = await this.pool.query<User>(`SELECT * FROM users WHERE
            name = $1 or email = $2`, [name, email])
        return users.rows
    }

    async getUserByName(name: string): Promise<User[]> {
        const users = await this.pool.query<User>(`SELECT * FROM users WHERE
            name = $1`, [name])
        return users.rows
    }
    
    async CreateRefreshToken
        (user_id: number | string, token: string, expires_at: Date): Promise<RefreshToken>
    {
        const refreshToken = await this.pool.query<RefreshToken>(`INSERT INTO tokens
            (user_id, token, expires_at) VALUES
            ($1, $2, $3) RETURNING *`, [user_id, token, expires_at])
        
        return refreshToken.rows[0]
    }

    async findRefreshToken(token: string): Promise<RefreshToken> {
        const result = await this.pool.query(
            `SELECT * FROM tokens WHERE token = $1`,
            [token]
        );
        return result.rows[0];
    }

    async deleteRefreshToken(id: number | string): Promise<void> {
        await this.pool.query(`DELETE FROM tokens WHERE id = $1`, [id])
    }
}
