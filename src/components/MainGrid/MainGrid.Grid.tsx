import { Theme, useMediaQuery } from '@mui/material';
import {
    DataGrid, GridColDef, GridRowId, GridRowModel, GridSelectionModel
} from '@mui/x-data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';
import MainGridFooter from './MainGrid.Footer';
import LoadingOverlay from './MainGrid.LoadingOverlay';
import SelectionToolbar from './MainGrid.SelectionToolbar';
import GridToolbar from './MainGrid.Toolbar';

export interface MainGridProps {
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
    onScroll?: (e: Event, scrollPos: number) => void;
    showPagination?: boolean;
}

interface MainGridState {
    displaySelectionToolbar: boolean;
    selectedGridRows: GridRowId[];
}

export default function MainGrid(props: MainGridProps) {

    const [state, setState] = useState<MainGridState>({
        displaySelectionToolbar: false,
        selectedGridRows: [],
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const columns = props.columns;

    const onGridScroll = useCallback((e: Event) => {
        if (props.onScroll) {
            props.onScroll(e, (e.currentTarget as HTMLDivElement).scrollTop);
        }
    }, [props]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const scrollDiv = containerRef.current.querySelector('div.MuiDataGrid-virtualScroller');
        if (scrollDiv) {
            scrollDiv.addEventListener('scroll', onGridScroll);
            return () => {
                scrollDiv.removeEventListener('scroll', onGridScroll);
            }
        }
    }, [onGridScroll]);

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
            <div style={{ flexGrow: 1 }} ref={containerRef}>
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
