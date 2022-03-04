import { Delete } from '@mui/icons-material/';
import { Box } from '@mui/system';
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridRowData,
    GridRowId,
    GridSelectionModel,
    GridValueFormatterParams
} from '@mui/x-data-grid';
import uniqueId from 'lodash/uniqueId';
import { ReactChild, useState } from 'react';
import ActionButton from './MainGrid.ActionButton';
import MainGridFooter from './MainGrid.Footer';
import LoadingOverlay from './MainGrid.LoadingOverlay';
import SelectionToolbar from './MainGrid.SelectionToolbar';
import GridToolbar from './MainGrid.Toolbar';

export interface GridProps {
    rows: GridRowData[];
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

const queryWrapped = (query: string): ReactChild => {

    return (
        <Box sx={{ color: 'primary.main' }} key={uniqueId()}>
            {query}
        </Box>
    );
};

export default function MainGrid(props: GridProps) {
    const actionWidth = 42;

    const [state, setState] = useState({
        displaySelectionToolbar: false,
        selectedGridRows: [] as GridRowId[],
    });

    const cellRenderer = (params: GridValueFormatterParams) => {

        //Add a span wrap to highlight any search query
        if (typeof params.value === 'string' && props.searchQuery.length) {

            const regex = new RegExp(props.searchQuery, 'ig');

            const matches: string[] = [];
            params.value.replace(regex, function (match) {
                matches.push(match);
                return match;
            });

            if (matches.length) {
                const result: ReactChild[] = [];
                const parts = params.value.split(regex);

                parts.map((part, index) => {
                    const spaces = part.split(' ');
                    spaces.map((str, index) => {
                        result.push(str);
                        if (index < spaces.length - 1) {
                            //JSX requires special handling of spaces..
                            const space = <Box key={uniqueId()}>&nbsp;</Box>;
                            result.push(space);
                        }
                    });

                    if (index < parts.length - 1) {
                        const match = matches.shift();
                        result.push(queryWrapped(match ?? ""));
                    }
                });

                return result;
            }
        }
        return params.value;
    };

    const columnActions: GridColDef[] = [{
        field: 'edit',
        headerName: 'Edit',
        width: actionWidth,
        align: 'center',
        minWidth: 1,
        headerClassName: 'no-header',
        renderHeader: () => <></>,
        hideSortIcons: true,
        disableColumnMenu: true,
        filterable: false,
        /*renderCell: (params) => {
                  return (
                      <GridActionButton rowData={params.row} onClick={props.onEdit}>
                          <Edit />
                      </GridActionButton>
                  );
              },*/
    },
    {
        field: 'delete',
        headerName: 'Delete',
        minWidth: 1,
        width: actionWidth,
        align: 'center',
        renderHeader: () => <></>,
        hideSortIcons: true,
        headerClassName: 'no-header',
        disableColumnMenu: true,
        filterable: false,
        // renderCell: (params) => {
        //     return (
        //         <ActionButton rowData={params.row} onClick={props.onDelete}>
        //             <Delete />
        //         </ActionButton>
        //     );
        // },
    }];

    //const columns = props.columns.map(v => ({ ...v, renderCell: cellRenderer }));
    const columns = props.columns;

    const onSelectionChange = (
        selRows: GridSelectionModel,
        details: GridCallbackDetails) => {

        setState({
            ...state,
            displaySelectionToolbar: (selRows.length > 0),
            selectedGridRows: selRows
        });
    }

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
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
                <DataGrid
                    columns={columns}
                    rows={props.rows}
                    loading={props.loading}
                    pagination
                    paginationMode="server"
                    className="contactList"
                    //checkboxSelection
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    autoHeight={true}
                    disableColumnSelector={true}
                    onSelectionModelChange={onSelectionChange}
                    sx={{
                        border: 0
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
                            showPagination: props.showPagination
                        }
                    }}
                />
            </div>
        </div>
    );
}
