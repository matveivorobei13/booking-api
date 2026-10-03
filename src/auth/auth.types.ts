import { User } from "../users/user.types"

export interface RefreshToken {
    id: number | string,
    token: string,
    user_id: string,
    created_at: Date,
    expires_at: Date
}

export type Register = {
    user: Omit<User, "password">,
    access: string,
    refresh: string,
}
