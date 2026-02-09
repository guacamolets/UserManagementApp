export type UserStatus = "active" | "blocked" | "unverified";

export interface UserDto {
    id: number;
    name: string;
    email: string;
    lastLogin?: string | null;
    status: UserStatus;
}

export type UserAction = "Block" | "Unblock" | "Delete" | "DeleteUnverified";