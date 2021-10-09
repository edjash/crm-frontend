import { useState, useEffect } from 'react';
import apiClient from '../../common/apiClient';
import ContactsGrid, { ContactsGridProps } from './Contacts.Grid';
import { GridRowId } from '@material-ui/data-grid';
import TopBar from '../../common/TopBar';
import Paper from '@material-ui/core/Paper';

export default function Contacts() {
  const [gridState, setGridState] = useState<ContactsGridProps>({
    searchQuery: '',
    rows: [],
    loading: true,
    init: true,
    page: 1,
    rowCount: 10,
    pageSize: 10,
    pageCount: 10,
  });

  const onDelete = (rowIds: GridRowId[]) => {
    const rowData = [];
    for (const row of gridState.rows) {
      if (rowIds.indexOf(row.id) > -1) {
        rowData.push(row);
      }
    }

    //console.log('ROW IDS', rowIds);
  };

  const handleSearch = (query: string) => {
    setGridState({ ...gridState, searchQuery: query, loading: true });
  };

  const handleDelete = (rowIds: GridRowId[]) => {
    setGridState({ ...gridState, loading: true });

    apiClient
      .delete('/contacts/' + rowIds.join(','))
      .then((res) => {
        setGridState({ ...gridState, loading: true });
        loadContacts(gridState.page);
      })
      .catch((error) => {
        console.log('Delete error!', error);
      });
  };

  const loadContacts = (page: number) => {
    apiClient
      .get('/contacts', {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: gridState.pageSize,
        search: gridState.searchQuery,
        page: page,
      })
      .then((res) => {
        setGridState({
          ...gridState,
          rowCount: res.data.total,
          rows: res.data.data,
          pageCount: Math.ceil(res.data.total / gridState.pageSize),
          loading: false,
          init: false,
          searchQuery:''
        });
      })
      .catch((error) => {
        if (error) {
          error = 4;
        }
        setGridState({ ...gridState, loading: false });
      });
  };

  const onPageChange = (event: object, newPage: number) => {
    setGridState({
      ...gridState,
      page: newPage,
      loading: true,
    });
  };

  useEffect(() => {
    if (gridState.loading) {
      const delay = gridState.init ? 1000 : 0;
      const timer = setTimeout(() => {
        loadContacts(gridState.page);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gridState.page, gridState.loading]);

  return (
    <Paper>
      <TopBar />
      <ContactsGrid
        {...gridState}
        onPageChange={onPageChange}
        onDelete={onDelete}
      />
    </Paper>
  );
}
