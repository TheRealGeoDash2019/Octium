function ContextMenuButton({ displayLabel, onClick }) {
    const label = displayLabel || "Unknown Action";
    const onClickEvent = onClick || (() => null);
    return (
        <>
            <div className="contextMenuButton" onClick={onClickEvent}>
                {label}
            </div>
        </>
    )
}

export default ContextMenuButton;