import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import MainGrid, { GridProps } from '../MainGrid/MainGrid.Grid';
import { GridRowId, GridColDef } from '@material-ui/data-grid';
import ConfirmDialog from '../ConfirmDialog';
import { useModal } from 'mui-modal-provider';
import CreateEditDlg from './Companies.CreateEdit';
import { Paper } from '@material-ui/core';
import PubSub from 'pubsub-js'

export default function Companies() {

    const { showModal } = useModal();

    const [gridState, setGridState] = useState<GridProps>({
        title: 'Companies',
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
                The following Companies will be deleted:
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
                        {row.name}
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
            .delete('/companies/' + rowIds.join(','))
            .then((res) => {
                loadCompanies(gridState.page);
            }).catch((error) => {
                console.log('Delete error!', error);
            });
    };

    const loadCompanies = (page: number) => {
        apiClient
            .get('/companies', {
                sortBy: 'id',
                sortDirection: 'desc',
                limit: gridState.pageSize,
                search: gridState.searchQuery,
                page: page,
            })
            .then((res) => {
                if (res.data.last_page < res.data.current_page) {
                    return loadCompanies(res.data.last_page);
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
            onConfirm: () => {
                PubSub.publish('EDIT_CONTACT');
            },
        });
    }

    useEffect(() => {
        PubSub.subscribe('EDIT_COMPANY', onCreateClick);


        return () => { PubSub.unsubscribe('EDIT_COMPANY'); };
    }, []);

    useEffect(() => {
        if (gridState.loading) {
            const delay = gridState.init ? 1000 : 0;
            const timer = setTimeout(() => {
                loadCompanies(gridState.page);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [gridState.page]);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
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
                    : [a.steet, a.town, a.county, a.postcode, a.country]
                        .filter((e) => e)
                        .join(', ');

                return v;
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
        }
    ];

    return (
        <Paper>
            <MainGrid
                {...gridState}
                columns={columns}
                onSearch={onSearch}
                onCreateClick={onCreateClick}
                onPageChange={onPageChange}
                onDelete={onDelete}
            />
        </Paper>
    );
}
