import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";
import { logout } from "./auth";

interface Props {
    selectedIds: number[];
    onAction: () => void;
}

export default function Toolbar({ selectedIds, onAction }: Props) {
    const navigate = useNavigate();

    async function executeAction(action: string) {
        if (selectedIds.length === 0) {
            console.warn("No users selected");
            return;
        }

        console.log("Executing action", action, selectedIds);

        await apiFetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ userIds: selectedIds, action: action })
        });

        const currentUserId = Number(localStorage.getItem("userId"));
        if (action === "Block" && selectedIds.includes(currentUserId)) {
            localStorage.removeItem("userId");
            logout();
            navigate("/login");
            return;
        }

        onAction();
    }

    const disabled = selectedIds.length === 0;

    return (
        <div>
            <button disabled={disabled} title="Blocks selected users and prevents login" onClick={() => executeAction("Block")}>Block</button>
            <button disabled={disabled} title="Unblock selected users and allow login" onClick={() => executeAction("Unblock")}>Unblock</button>
            <button disabled={disabled} title="Delete selected users permanently" onClick={() => executeAction("Delete")}>Delete</button>
            <button disabled={disabled} title="Delete unverified selected permanently" onClick={() => executeAction("DeleteUnverified")}>Delete unverified</button>
        </div>
    );
}
