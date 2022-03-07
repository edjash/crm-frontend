import IconButton from '@mui/material/IconButton';
import { GridRowModel } from '@mui/x-data-grid';
import { ReactNode } from 'react';

export interface ActionButtonProps {
    onClick?: (action: string, data: GridRowModel) => void;
    name: string;
    rowData: GridRowModel;
    children: ReactNode;
}

export default function ActionButton(props: ActionButtonProps) {
    const onClick = () => {
        if (props.onClick) {
            props.onClick(props.name, props.rowData);
        }
    };

    return (
        <IconButton
            edge="start"
            color="inherit"
            onClick={onClick}
        >
            {props.children}
        </IconButton>
    );
}
