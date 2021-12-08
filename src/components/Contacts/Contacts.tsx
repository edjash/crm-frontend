import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import MainGrid, { GridProps } from '../MainGrid/MainGrid.Grid';
import { GridRowId, GridColDef } from '@mui/x-data-grid';
import ConfirmDialog from '../ConfirmDialog';
import { useModal } from 'mui-modal-provider';
import CreateEditDlg from './Contacts.CreateEdit';
import { Paper } from '@mui/material';
import PubSub from 'pubsub-js'

export default function Contacts() {

  const { showModal } = useModal();

  const [gridState, setGridState] = useState<GridProps>({
    title: 'Contacts',
    searchQuery: '',
    searchChanged: false,
    rows: [],
    columns: [],
    loading: true,
    init: true,
    page: 1,
    rowCount: 10,
    pageSize: 10,
    pageCount: 10
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
        handleDelete(dialogData);
      },
    });
  };

  const handleDelete = (rowIds: GridRowId[]) => {
    setGridState({ ...gridState, loading: true });

    apiClient
      .delete('/contacts/' + rowIds.join(','))
      .then((res) => {
        loadContacts(gridState.page);
      }).catch((error) => {
        console.log('Delete error!', error);
      });
  };

  const loadContacts = (page: number, searchQuery?: string) => {

    apiClient
      .get('/contacts', {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: gridState.pageSize,
        search: searchQuery,
        page: page,
      })
      .then((res) => {
        if (res.data.last_page < res.data.current_page) {
          return loadContacts(res.data.last_page);
        }

        setGridState({
          ...gridState,
          page: res.data.current_page,
          rowCount: res.data.total,
          rows: res.data.data,
          pageCount: Math.ceil(res.data.total / gridState.pageSize),
          loading: false,
          init: false,
          searchChanged: false,
        });
      })
      .catch((error) => {
        if (error) {
          error = 4;
        }
        setGridState({ ...gridState, loading: false });
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
    loadContacts(1, query);
  };

  const onPageChange = (event: object, newPage: number) => {
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
    loadContacts(gridState.page);
    PubSub.publish('TOAST.SHOW', {
      message: "Refreshed"
    })
  };

  useEffect(() => {
    PubSub.subscribe('CONTACTS.REFRESH', onRefreshClick);

    loadContacts(1);

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
      headerClassName: 'no-header',
      valueGetter: (params) => {
        const a = params.row.address[0];
        const v = !a
          ? ''
          : [a.street, a.town, a.county, a.postcode, a.country]
            .filter((e) => e)
            .join(', ');

        return v;
      },
    }];

  return (
    <MainGrid
      {...gridState}
      columns={columns}
      onSearch={onSearch}
      onCreateClick={onCreateClick}
      onRefreshClick={onRefreshClick}
      onPageChange={onPageChange}
      onDelete={onDelete}
    />
  );
}
