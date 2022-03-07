import { Box, Button, Checkbox, Theme, Toolbar, useMediaQuery } from '@mui/material';
import {
    GridRowId
} from '@mui/x-data-grid';
import { ChangeEvent } from 'react';

type ToolbarProps = {
    selRows: GridRowId[],
    onDelete?: (rowIds: GridRowId[]) => void;
};

export default function MainGridSelectionToolbar(props: ToolbarProps) {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const selectedRowCount = props.selRows.length;

    if (!selectedRowCount) {
        return <></>;
    }

    const deleteText = 'Delete Selected';

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        PubSub.publishSync('GRID.CHECKALL', checked);
    };

    const handleDelete = () => {
        if (props.onDelete) {
            props.onDelete(props.selRows);
        }
    };

    return (
        <Toolbar disableGutters>
            {isMobile &&
                <Box sx={{ width: 60, textAlign: 'center' }}>
                    <Checkbox onChange={handleChange} />
                </Box>
            }
            <Button variant="outlined" onClick={handleDelete}>{deleteText}</Button>
        </Toolbar >
    );
}