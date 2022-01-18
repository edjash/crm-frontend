import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import MainGrid, { GridProps } from '../MainGrid/MainGrid.Grid';
import { GridRowId, GridColDef } from '@mui/x-data-grid';
import ConfirmDialog from '../ConfirmDialog';
import { useModal } from 'mui-modal-provider';
import CreateEditDlg from './Contacts.CreateEdit';
import PubSub from 'pubsub-js'
import { Method } from 'axios';

export default function Contacts() {

  const { showModal } = useModal();

  const [gridState, setGridState] = useState<GridProps>({
    title: 'Contact',
    titlePlural: 'Contacts',
    searchQuery: '',
    searchChanged: false,
    rows: [],
    columns: [],
    loading: false,
    deleteIds: [],
    page: 1,
    rowCount: 10,
    rowsPerPage: 10,
    pageCount: 10,
  });

  const onDelete = (rowIds: GridRowId[]) => {

    const dialogContent: JSX.Element[] = [
      <span key="0">
        The following Contacts will be deleted:
        <br />
      </span>
    ];
    const dialogData: GridRowId[] = [];

    for (const row of gridState.rows) {
      if (rowIds.indexOf(row.id) > -1) {
        dialogData.push(row.id);
        dialogContent.push(
          <span key={row.id}>
            <br />
            {row.firstname + ' ' + row.lastname}
          </span>
        );
      }
    }

    const confirm = showModal(ConfirmDialog, {
      title: 'Confirm Delete',
      content: dialogContent,
      onCancel: () => {
        confirm.hide();
      },
      onConfirm: () => {
        confirm.hide();

        setGridState({
          ...gridState,
          deleteIds: dialogData,
          loading: true
        });
      },
    });
  };

  const loadContacts = () => {

    let method: Method = 'GET';
    let endpoint = '/contacts';

    if (gridState.deleteIds.length) {
      endpoint += '/' + gridState.deleteIds.join(',');
      method = 'DELETE';
    }

    apiClient
      .request(method, endpoint, {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: gridState.rowsPerPage,
        search: gridState.searchQuery,
        page: gridState.page,
      }, true)
      .then((res) => {
        if (res.data.last_page < res.data.current_page) {
          setGridState({
            ...gridState,
            deleteIds: [],
            page: res.data.last_page
          });
          return;
        }

        setGridState({
          ...gridState,
          page: res.data.current_page,
          rowCount: res.data.total,
          rows: res.data.data,
          pageCount: Math.ceil(res.data.total / gridState.rowsPerPage),
          loading: false,
          deleteIds: [],
          searchChanged: false,
        });
      })
      .catch((error) => {
        if (error) {
          error = 4;
        }
        setGridState({
          ...gridState,
          deleteIds: [],
          loading: false
        });
      });
  };

  const onSearch = (query: string) => {
    setGridState({
      ...gridState,
      searchQuery: query,
      searchChanged: true,
      page: 1,
      loading: true,
    });
  };

  const onPageChange = (newPage: number) => {
    if (newPage != gridState.page) {
      setGridState({
        ...gridState,
        page: newPage,
        loading: true,
      });
    }
  };

  const onCreateClick = () => {
    const dlg = showModal(CreateEditDlg, {
      type: 'new',
      onCancel: () => {
        dlg.hide();
      },
      onSave: () => {
        dlg.destroy();
      },
    });
  };

  const onRefreshClick = () => {
    setGridState({
      ...gridState,
      loading: true,
    });

    PubSub.publish('TOAST.SHOW', {
      message: "Refreshed"
    })
  };

  useEffect(() => {
    if (gridState.loading) {
      loadContacts();
    }
  }, [gridState.loading]);

  useEffect(() => {
    PubSub.subscribe('CONTACTS.REFRESH', onRefreshClick);

    setGridState({
      ...gridState,
      loading: true
    });

    return () => {
      PubSub.unsubscribe('CONTACTS');
    }
  }, []);

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
      width: 410,
      valueGetter: (params: any) => {
        return params.row.address[0].full_address;
      },
    }];

  return (
    <MainGrid
      {...gridState}
      columns={columns}
      onSearch={onSearch}
      onCreateClick={onCreateClick}
      onPageChange={onPageChange}
      onDelete={onDelete}
      onRefreshClick={onRefreshClick}
    />
  );
}
