import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowId,
  GridValueFormatterParams,
  GridCellValue,
} from '@material-ui/data-grid';
import { ReactChild } from 'react';
import { Delete, TextsmsTwoTone } from '@material-ui/icons/';
import GridFooter from './Contacts.Grid.Footer';
import GridActionButton from './Contacts.Grid.ActionButton';
import ContactsToolbar from './Contacts.Toolbar';
import { result } from 'lodash';
import { useTheme } from '@material-ui/core/styles';

export interface ContactsGridProps {
  rows: GridRowData[];
  loading: boolean;
  page: number;
  rowCount: number;
  pageSize: number;
  pageCount: number;
  init: boolean;
  searchQuery: string;
  searchChanged: boolean;
  onSearch?: (value: string) => void;
  onPageChange?: (event: object, page: number) => void;
  onEdit?: () => void;
  onDelete?: (rowIds: GridRowId[]) => void;
}

export default function ContactsGrid(props: ContactsGridProps) {
  const actionWidth = 42;

  const theme = useTheme();

  const formatValue = (value: string | GridCellValue) => {
    return value;
  };

  const cellRenderer = (params: GridValueFormatterParams) => {
    if (typeof params.value === 'string' && props.searchQuery.length) {
      let rv = <span style={{color:theme.palette.primary.main}} key="0">{props.searchQuery}</span>;
      let parts = params.value.split(new RegExp(props.searchQuery, 'i'));
      let result: ReactChild[] = [];

      parts.forEach((v) => {
        result.push(v);
        result.push(rv);
      });

      result.pop();

      return result;
    }
    return params.value;
  };

  const valueFormatter = (params: GridValueFormatterParams) => {
    return formatValue(params.value);
  };

  const columns: GridColDef[] = [
    {
      field: 'firstname',
      headerName: 'First name',
      width: 250,
      renderCell: cellRenderer,
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      width: 250,
      renderCell: cellRenderer,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 510,
      headerClassName: 'no-header',
      renderCell: cellRenderer,
      valueGetter: (params) => {
        const a = params.row.address[0];
        const v = !a
          ? ''
          : [a.line1, a.line2, a.town, a.postcode, a.country]
              .filter((e) => e)
              .join(', ');

        return formatValue(v);
      },
    },
    {
      field: 'spacer',
      flex: 1,
      headerName: '',
      headerClassName: 'no-header',
      renderHeader: () => <></>,
      hideSortIcons: true,
      disableColumnMenu: true,
      filterable: false,
    },
    {
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
          <GridActionButton rowData={params.row} onClick={props.onDelete}>
            <Delete />
          </GridActionButton>
        );
      },
    },
  ];

  return (
    <>
      <ContactsToolbar onSearch={props.onSearch} />
      <DataGrid
        columns={columns}
        rows={props.rows}
        loading={props.loading}
        pagination
        paginationMode="server"
        className="contactList"
        checkboxSelection
        disableSelectionOnClick
        autoHeight={true}
        rowHeight={44}
        disableColumnSelector={true}
        components={{
          Footer: () => (
            <GridFooter
              onPageChange={props.onPageChange}
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
