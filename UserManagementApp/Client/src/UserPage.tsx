import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { type UserDto } from "./User";
import Toolbar from "./Toolbar";
import UserTable from "./UserTable";
import { useToastContext } from "./ToastContext";

export default function UserPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { showToast } = useToastContext();

    async function loadUsers() {
        try {
            const data = await apiFetch("/api/users");
            setUsers(data);
            setSelectedIds([]);
        } catch (err) {
            console.error("Users loading error:", err);
            showToast("Users loading error", "error");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadUsers();
        };

        fetchData();
    }, []);

    function toggleUser(id: number) {
        setSelectedIds(function (prev: number[]) {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    }

    function toggleAllUser(checked: boolean) {
        setSelectedIds(checked ? users.map(u => u.id) : []);
    }

    return (
        <>
            <Toolbar onAction={loadUsers} selectedIds={selectedIds}/>
            <UserTable users={users} selectedIds={selectedIds}
                onToggle={toggleUser} onToggleAll={toggleAllUser}
            />
        </>
    );
}