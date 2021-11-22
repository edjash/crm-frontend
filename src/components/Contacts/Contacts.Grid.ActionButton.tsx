import IconButton from '@material-ui/core/IconButton';
import {GridRowModel, GridRowId} from '@material-ui/data-grid';

export interface IGridActionButton {
  onClick?: (rowIds: GridRowId[]) => void;
  rowData: GridRowModel;
  children: JSX.Element;
}

export default function GridActionButton(cfg: IGridActionButton) {
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
