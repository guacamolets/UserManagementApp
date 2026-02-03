import { type UserAction } from "./User";

interface Props {
    selectedIds: number[];
    onAction: (action: UserAction) => void;
}

export default function UserToolbar({ selectedIds, onAction }: Props) {
    const disabled = selectedIds.length === 0;

    return (
        <div>
            <button disabled={disabled} onClick={() => onAction("Block")}>Block</button>
            <button disabled={disabled} onClick={() => onAction("Unblock")}>Unblock</button>
            <button disabled={disabled} onClick={() => onAction("Delete")}>Delete</button>
            <button disabled={disabled} onClick={() => onAction("DeleteUnverified")}>Delete unverified</button>
        </div>
    );
}
