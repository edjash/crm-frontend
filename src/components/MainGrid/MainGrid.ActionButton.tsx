import IconButton from '@mui/material/IconButton';
import { GridRowModel, GridRowId } from '@mui/x-data-grid';

export interface IGridActionButton {
    onClick?: (rowIds: GridRowId[]) => void;
    rowData: GridRowModel;
    children: JSX.Element;
}

export default function ActionButton(cfg: IGridActionButton) {
    const onClick = () => {
        cfg?.onClick?.call(undefined, [cfg.rowData.id]);
    };

    return (
        <IconButton
            edge="start"
            color="inherit"
            aria-label="delete"
            onClick={onClick}
            focusRipple={false}
        >
            {cfg.children}
        </IconButton>
    );
}
