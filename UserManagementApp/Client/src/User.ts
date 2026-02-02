export type UserStatus = "active" | "blocked";

export interface UserDto {
    id: number;
    name: string;
    email: string;
    lastLogin?: string | null;
    status: UserStatus;
}

export type UserAction = "block" | "unblock" | "delete";