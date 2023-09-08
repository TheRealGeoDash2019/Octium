import menuTypes from "./menus";

interface PositionData {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
}

const getMenuChildren = (type: string, hideFunc: Function) => {
    type = type.toLowerCase();
    const hideFunction = hideFunc || (() => null);
    if (type === "options") {
        return <menuTypes.Options hideFn={hideFunction}></menuTypes.Options>
    } else {
        return <></>
    }
}

function ContextMenu({ children, menuType, position, className, hideFn }) {
    const typeOfMenu = (menuType? menuType.toString() : "empty")
    const menuExists = (!!menuTypes[menuType] || false);
    const positionData = position as PositionData || {} as PositionData;
    const hideFunction = hideFn || (() => null);
    const attributeClassName = className? ` ${className}` : "";
    const newClassName = `contextMenu${attributeClassName}`;
    return (
        <>
            <div className={newClassName} style={ positionData }>
                {menuExists? getMenuChildren(menuType, hideFunction) : <></>}
            </div>
        </>
    );
}

export default ContextMenu;