import { useEffect, useState } from "react";
import { type UserDto } from "./User";
import Toolbar from "./Toolbar";
import UserTable from "./UserTable";

const API_BASE = "https://localhost:7127";

export function UserPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    function fetchUsers() {
        fetch(`${API_BASE}/api/users`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("err");
                }
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => alert(err.message));
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    function toggleUser(id: number) {
        setSelectedIds(function (prev: number[]) {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    }

    function executeAction(action: string) {
        if (selectedIds.length === 0) {
            console.warn("No users selected");
            return;
        }

        console.log("Executing action", action, selectedIds);

        fetch("https://localhost:7127/api/users/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userIds: selectedIds,
                action: action
            })
        })
            .then(res => {
                console.log("status:", res.status);
                if (!res.ok) {
                    return res.json().then(err => {
                        console.error("Server error:", err);
                        throw new Error("Request failed");
                    }).catch(() => { throw new Error("Request failed"); });
                }
                return res.json().catch(() => ({}));
            })
            .then(() => {
                setSelectedIds([]);
                fetchUsers();
            })
            .catch(err => alert(err.message));
    }

    return (
        <div>
            <h2>Users</h2>

            <Toolbar onAction={executeAction} selectedIds={selectedIds}/>
            <UserTable users={users} selectedIds={selectedIds}
                onToggle={toggleUser} onToggleAll={function(): void {
                    throw new Error("Function not implemented.");
                } }/>
        </div>
    );
}