import { Menu, MenuItem, MenuProps } from "@mui/material";
import { useState } from "react";

type ContextMenuPosition = {
    x: number;
    y: number;
};

interface ContextMenuState {
    position: ContextMenuPosition | null;
    data?: any;
}

interface ContextMenuHandler {
    state: ContextMenuState;
    update: (newState: ContextMenuState) => void;
    close: () => void;
}

export const bindContextMenu = (contextMenu: ContextMenuHandler, data: any) => {

    return {
        onContextMenu: (event: React.MouseEvent) => {
            event.preventDefault();
            contextMenu.update({
                position: {
                    x: event.clientX,
                    y: event.clientY,
                },
                data: data
            });
        }
    };
}

export const useContextMenuHandler = (): ContextMenuHandler => {
    const [state, setState] = useState<ContextMenuState>({
        position: null,
        data: null,
    });

    const close = () => {
        setState(state => ({
            ...state,
            position: null,
        }));
    }

    const update = (newState: ContextMenuState) => {
        setState(newState);
    }

    return {
        state: state,
        update: update,
        close: close,
    }
}

export const bindMenu = (contextMenu: ContextMenuHandler): MenuProps => {

    const handleClose = () => {
        contextMenu.close();
    };

    return {
        open: (contextMenu.state.position !== null),
        onClose: handleClose,
        anchorReference: "anchorPosition",
        anchorPosition: (contextMenu.state.position === null)
            ? undefined
            : {
                top: contextMenu.state.position.y,
                left: contextMenu.state.position.x
            }
    }
};

interface ContextMenuItem {
    label: string;
    key: string;
}

interface ContextMenuProps {
    contextMenuHandler: ContextMenuHandler;
    items: ContextMenuItem[];
    onItemClick: (item: ContextMenuItem, data?: any) => void;
}

export default function ContextMenu(props: ContextMenuProps) {

    return (
        <Menu
            {...bindMenu(props.contextMenuHandler)}
        >
            {props.items.map((item, index) => (
                <MenuItem
                    key={item.key}
                    onClick={() => {
                        props.contextMenuHandler.close();
                        props.onItemClick(item, props.contextMenuHandler.state.data);
                    }}
                >
                    {item.label}
                </MenuItem>
            ))}
        </Menu >
    );
}
