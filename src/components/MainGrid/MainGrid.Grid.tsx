import { Theme, useMediaQuery } from '@mui/material';
import {
    DataGrid, GridColDef,
    GridRowModel,
    GridRowId,
    GridSelectionModel
} from '@mui/x-data-grid';
import { useState } from 'react';
import MainGridFooter from './MainGrid.Footer';
import LoadingOverlay from './MainGrid.LoadingOverlay';
import SelectionToolbar from './MainGrid.SelectionToolbar';
import GridToolbar from './MainGrid.Toolbar';

export interface GridProps {
    rows: GridRowModel[];
    columns: GridColDef[];
    title: string;
    titlePlural: string;
    loading: boolean;
    page: number;
    rowCount: number;
    rowsPerPage: number;
    pageCount: number;
    searchQuery: string;
    searchChanged: boolean;
    deleteIds: GridRowId[],
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onPageChange?: (page: number) => void;
    onEdit?: () => void;
    onDelete?: (rowIds: GridRowId[]) => void;
    onRefreshClick?: () => void;
    showPagination?: boolean;
}

export default function MainGrid(props: GridProps) {

    const [state, setState] = useState({
        displaySelectionToolbar: false,
        selectedGridRows: [] as GridRowId[],
    });

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const columns = props.columns;

    const onSelectionChange = (selRows: GridSelectionModel) => {
        setState({
            ...state,
            displaySelectionToolbar: (selRows.length > 0),
            selectedGridRows: selRows
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                {state.displaySelectionToolbar ?
                    <SelectionToolbar
                        selRows={state.selectedGridRows}
                        onDelete={props.onDelete}
                    />
                    :
                    <GridToolbar
                        onSearch={props.onSearch}
                        onCreateClick={props.onCreateClick}
                        title={props.title}
                        titlePlural={props.titlePlural}
                        onPageChange={props.onPageChange}
                        pageCount={props.pageCount}
                        page={props.page}
                        loading={props.loading}
                        searchChanged={props.searchChanged}
                    />
                }
            </div>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    columns={columns}
                    rows={props.rows}
                    loading={props.loading}
                    pagination
                    paginationMode="server"
                    headerHeight={isMobile ? 0 : 42}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    
                    disableColumnSelector={true}
                    onSelectionModelChange={onSelectionChange}
                    sx={{
                        border: 0,
                    }}
                    components={{
                        LoadingOverlay: LoadingOverlay,
                        Footer: MainGridFooter,
                    }}
                    componentsProps={{
                        footer: {
                            rowCount: props.rowCount,
                            page: props.page,
                            pageCount: props.pageCount,
                            onPageChange: props.onPageChange,
                            searchChanged: props.searchChanged,
                            onRefreshClick: props.onRefreshClick,
                            showPagination: props.showPagination,
                            rowsPerPage: props.rowsPerPage,
                        }
                    }}
                />
            </div>
        </div>
    );
}
