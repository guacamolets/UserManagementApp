import { type UserAction } from "./User";

interface Props {
    selectedIds: number[];
    onAction: (action: UserAction) => void;
}

export default function UserToolbar({ selectedIds, onAction }: Props) {
    const disabled = selectedIds.length === 0;

    return (
        <div>
            <button disabled={disabled} onClick={() => onAction("block")}>Block</button>
            <button disabled={disabled} onClick={() => onAction("unblock")}>Unblock</button>
            <button disabled={disabled} onClick={() => onAction("delete")}>Delete</button>
        </div>
    );
}
