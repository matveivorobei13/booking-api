export interface Booking {
    id: number | string,
    room_id: number | string,
    user_id: number | string,
    start_at: Date,
    end_at: Date,
    status: "active" | "completed" | "cancelled"
    created_at: Date 
}