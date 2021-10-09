import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowId,
} from '@material-ui/data-grid';
import { Delete } from '@material-ui/icons/';
import GridFooter from './Contacts.Grid.Footer';
import GridActionButton from './Contacts.Grid.ActionButton';
import ContactsToolbar from './Contacts.Toolbar';


export interface ContactsGridProps {
  searchQuery: string;
  rows: GridRowData[];
  loading: boolean;
  page: number;
  rowCount: number;
  pageSize: number;
  pageCount: number;
  init: boolean;
  onPageChange?: (event: object, page: number) => void;
  onEdit?: () => void;
  onDelete?: (rowIds: GridRowId[]) => void;
}

export default function ContactsGrid(props: ContactsGridProps) {
  const actionWidth = 42;

  const columns: GridColDef[] = [
    {
      field: 'firstname',
      headerName: 'First name',
      width: 250,
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      width: 250,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 510,
      headerClassName: 'no-header',
      valueFormatter: (params) => {
        const a = params.row.address[0];
        return !a
          ? ''
          : [a.line1, a.line2, a.town, a.postcode, a.country]
              .filter((e) => e)
              .join(', ');
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
      <ContactsToolbar handleSearch={handleSearch} />
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
            />
          ),
        }}
      />
    </>
  );
}
