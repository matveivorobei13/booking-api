export interface User {
    id: number | string,
    name: string,
    email: string,
    password: string
    created_at: Date,
    role: "admin" | "user"
}

export type UserPublic = Omit<User, "password">

export interface UserPayload {
    id: number | string,
    role: "admin" | "user"
}