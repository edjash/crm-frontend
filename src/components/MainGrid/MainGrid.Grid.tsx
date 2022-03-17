import { Theme, useMediaQuery } from '@mui/material';
import {
    DataGrid, GridApi, GridApiRef, GridColDef, GridRenderCellParams, GridRowId, GridRowModel, GridSelectionModel, useGridApiContext
} from '@mui/x-data-grid';
import { RefObject, useCallback, useRef, useState } from 'react';
import useOnce from '../../hooks/useOnce';
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
    apiRef: null | GridApiRef;
    displaySelectionToolbar: boolean;
    selectedGridRows: GridRowId[];
}

export default function MainGrid(props: MainGridProps) {

    const [state, setState] = useState<MainGridState>({
        apiRef: null,
        displaySelectionToolbar: false,
        selectedGridRows: [],
    });

    const apiRef = useRef<GridApi>();
    const scrollRef = useRef<HTMLDivElement>();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const columns = props.columns;

    useOnce(() => {
        PubSub.subscribeOnce('MAINGRID.APIREF', (msg, data: GridApiRef) => {
            if (!data.current || apiRef.current) {
                return;
            }
            apiRef.current = data.current;
            console.log(data);
            setScrollEvent();
        });
    });

    const setScrollEvent = () => {
        if (!apiRef.current || scrollRef.current) {
            return;
        }
        console.log(123);
        if (apiRef.current.rootElementRef?.current) {
            const div: HTMLDivElement = apiRef.current.rootElementRef.current;
            const scrollDiv = div.querySelector('div.MuiDataGrid-virtualScroller');
            if (scrollDiv) {
                scrollRef.current = scrollDiv as HTMLDivElement;
                scrollDiv.addEventListener('scroll', onGridScroll);
            }
        }
    }

    const onGridScroll = useCallback((e: Event) => {
        if (props.onScroll) {
            props.onScroll(e, (e.currentTarget as HTMLDivElement).scrollTop);
        }
    }, [props]);

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
