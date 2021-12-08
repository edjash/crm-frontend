import { Button } from '@mui/material';
import {
    GridToolbarContainer,
    useGridApiContext,
    useGridState,
    GridRowId
} from '@mui/x-data-grid';

type ToolbarProps = {
    onDelete: (rowIds: GridRowId[]) => void;
};

export default function MainGridInnerToolbar(props: ToolbarProps) {

    const apiRef = useGridApiContext();
    const [gridState] = useGridState(apiRef);

    const selectedRowCount = gridState.selection.length;

    if (!selectedRowCount) {
        return <></>;
    }

    const deleteText = 'Delete Selected';

    const handleDelete = () => {
        props.onDelete(gridState.selection);
    };

    return (
        <GridToolbarContainer>
            <Button variant="outlined" onClick={handleDelete}>{deleteText}</Button>
        </GridToolbarContainer>
    );
}