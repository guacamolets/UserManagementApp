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

        await apiFetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ userIds: selectedIds, action: action })
        });

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
