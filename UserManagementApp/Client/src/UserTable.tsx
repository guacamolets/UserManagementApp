import { type UserDto } from "./User";

interface Props {
    users: UserDto[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    onToggleAll: (checked: boolean) => void;
}

export default function UserTable({ users, selectedIds, onToggle, onToggleAll }: Props) {
    const allChecked = users.length > 0 && selectedIds.length === users.length;

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" checked={allChecked} onChange={e => onToggleAll(e.target.checked)} />
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Last Login</th>
                </tr>
            </thead>
            <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(u.id)}
                                onChange={() => onToggle(u.id)}
                            />
                        </td>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.status}</td>
                        <td>{u.lastLogin}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
