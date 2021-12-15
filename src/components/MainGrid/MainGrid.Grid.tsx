import {
    DataGrid,
    GridColDef,
    GridRowData,
    GridRowId,
    GridValueFormatterParams,
} from '@mui/x-data-grid';
import { ReactChild } from 'react';
import { Delete } from '@mui/icons-material/';
import ActionButton from './MainGrid.ActionButton';
import GridToolbar from './MainGrid.Toolbar';
import LoadingOverlay from './MainGrid.LoadingOverlay';
import GridInnerToolbar from './MainGrid.InnerToolbar';
import MainGridFooter from './MainGrid.Footer';
import { Box } from '@mui/system';
import uniqueId from 'lodash/uniqueId';

export interface GridProps {
    rows: GridRowData[];
    columns: GridColDef[];
    title: string;
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
    onRefreshClick?: () => void;
    onPageChange?: (page: number) => void;
    onEdit?: () => void;
    onDelete?: (rowIds: GridRowId[]) => void;
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
        renderCell: (params) => {
            return (
                <ActionButton rowData={params.row} onClick={props.onDelete}>
                    <Delete />
                </ActionButton>
            );
        },
    }];

    const columns = props.columns.map(v => ({ ...v, renderCell: cellRenderer }));

    return (
        <>
            <GridToolbar
                onSearch={props.onSearch}
                onCreateClick={props.onCreateClick}
                onRefreshClick={props.onRefreshClick}
                title={props.title}
                onPageChange={props.onPageChange}
                pageCount={props.pageCount}
                page={props.page}
                loading={props.loading}
                searchChanged={props.searchChanged}
            />
            <DataGrid
                columns={columns}
                rows={props.rows}
                loading={props.loading}
                pagination
                paginationMode="server"
                className="contactList"
                checkboxSelection
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                autoHeight={true}
                disableColumnSelector={true}
                components={{
                    Toolbar: GridInnerToolbar,
                    LoadingOverlay: LoadingOverlay,
                    Footer: MainGridFooter
                }}
                componentsProps={{
                    toolbar: { onDelete: props.onDelete },
                    footer: {
                        rowCount: props.rowCount,
                        page: props.page,
                        pageCount: props.pageCount,
                        onPageChange: props.onPageChange,
                        searchChanged: props.searchChanged,
                    }
                }}
            />
        </>
    );
}
