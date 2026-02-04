import { apiFetch } from "./api";

interface Props {
    selectedIds: number[];
    onAction: () => void;
}

export default function Toolbar({ selectedIds, onAction }: Props) {
    async function executeAction(action: string) {
        if (selectedIds.length === 0) {
            console.warn("No users selected");
            return;
        }

        console.log("Executing action", action, selectedIds);

        await apiFetch("https://localhost:7127/api/users", {
            method: "POST",
            body: JSON.stringify({ userIds: selectedIds, action: action })
        });

        onAction();
    }

    const disabled = selectedIds.length === 0;

    return (
        <div>
            <button disabled={disabled} onClick={() => executeAction("Block")}>Block</button>
            <button disabled={disabled} onClick={() => executeAction("Unblock")}>Unblock</button>
            <button disabled={disabled} onClick={() => executeAction("Delete")}>Delete</button>
            <button disabled={disabled} onClick={() => executeAction("DeleteUnverified")}>Delete unverified</button>
        </div>
    );
}
