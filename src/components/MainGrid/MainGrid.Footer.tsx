import { Pagination } from '@mui/material';
import { GridRowId, useGridApiContext, useGridState } from '@mui/x-data-grid';
import NativeSelect from '@mui/material/NativeSelect';
import { useState } from 'react';

interface FooterProps {
    onDelete?: (rowIds: GridRowId[]) => void;
    onPageChange?: (event: object, page: number) => void;
    pageCount: number;
    page: number;
    loading: boolean;
    searchChanged: boolean;
}

export default function MainGridFooter(props: FooterProps) {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);

    const [actionValue, setActionValue] = useState('-');

    const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === '-') {
            return;
        }
        if (event.target.value === 'delete') {
            if (props.onDelete) {
                props.onDelete(state.selection);
            }
            setActionValue('-');
        }
    };

    const selectedRowCount = state.selection.length;
    let selectedRowCountElement = <div></div>;
    if (selectedRowCount) {
        const select = (
            <NativeSelect onChange={handleActionChange} value={actionValue}>
                <option value="-"></option>
                <option value="delete">Delete</option>
            </NativeSelect>
        );
        selectedRowCountElement = (
            <div className="selected-controls">
                <div>{selectedRowCount} Selected:</div>
                {select}
            </div>
        );
    }

    let PaginationElement = <></>;
    if (!props.loading || !props.searchChanged) {
        PaginationElement = (
            <Pagination
                count={props.pageCount}
                page={props.page}
                onChange={props.onPageChange}
                variant="outlined"
                shape="rounded"
            />
        );
    }

    return (
        <div className="cl-footer">
            {selectedRowCountElement}
            {PaginationElement}
        </div>
    );
}


