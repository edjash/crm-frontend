import {
    DataGrid,
    GridColDef,
    GridRowData,
    GridRowId,
    GridValueFormatterParams,
} from '@material-ui/data-grid';
import { ReactChild } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons/';
import GridFooter from './MainGrid.Footer';
import ActionButton from './MainGrid.ActionButton';
import GridToolbar from './MainGrid.Toolbar';
import LoadingOverlay from './MainGrid.LoadingOverlay';

export interface GridProps {
    rows: GridRowData[];
    columns: GridColDef[];
    title: string;
    loading: boolean;
    page: number;
    rowCount: number;
    pageSize: number;
    pageCount: number;
    init: boolean;
    searchQuery: string;
    searchChanged: boolean;
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onPageChange?: (event: object, page: number) => void;
    onEdit?: () => void;
    onDelete?: (rowIds: GridRowId[]) => void;
}

export default function MainGrid(props: GridProps) {
    const actionWidth = 42;

    const theme = useTheme();

    const cellRenderer = (params: GridValueFormatterParams) => {

        //Add a span wrap to highlight any search query
        if (typeof params.value === 'string' && props.searchQuery.length) {
            let queryWrapped = (
                <span style={{ color: theme.palette.primary.main }} key="0">
                    {props.searchQuery}
                </span>
            );

            const result: ReactChild[] = [];
            const parts = params.value.split(new RegExp(props.searchQuery, 'i'));
            const space = <span>&nbsp;</span>;

            parts.forEach((part, index) => {
                //JSX needs special handling of spaces
                let spaces = part.split(' ');
                spaces.forEach((str, index2) => {
                    result.push(str);
                    if (index2 < spaces.length - 1) {
                        result.push(space);
                    }
                });

                if (index < parts.length - 1) {
                    result.push(queryWrapped);
                }
            });

            return result;
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
                title={props.title}
            />
            <DataGrid
                columns={[...columns, ...columnActions]}
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
                rowHeight={44}
                disableColumnSelector={true}
                components={{
                    LoadingOverlay: LoadingOverlay,
                    Footer: () => (
                        <GridFooter
                            onPageChange={props.onPageChange}
                            onDelete={props.onDelete}
                            pageCount={props.pageCount}
                            page={props.page}
                            loading={props.loading}
                            searchChanged={props.searchChanged}
                        />
                    ),
                }}
            />
        </>
    );
}
