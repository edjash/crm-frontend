import { Button, Toolbar } from '@mui/material';
import {
    GridRowId
} from '@mui/x-data-grid';

type ToolbarProps = {
    selRows: GridRowId[],
    onDelete?: (rowIds: GridRowId[]) => void;
};

export default function MainGridSelectionToolbar(props: ToolbarProps) {


    const selectedRowCount = props.selRows.length;

    if (!selectedRowCount) {
        return <></>;
    }

    const deleteText = 'Delete Selected';

    const handleDelete = () => {
        if (props.onDelete) {
            props.onDelete(props.selRows);
        }
    };

    return (
        <Toolbar
            style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Button variant="outlined" onClick={handleDelete}>{deleteText}</Button>
        </Toolbar >
    );
}