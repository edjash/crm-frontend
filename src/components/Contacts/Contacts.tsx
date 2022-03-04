import { Box, IconButton, Link, Theme, useMediaQuery } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowId, GridRowModel } from '@mui/x-data-grid';
import { useModal } from 'mui-modal-provider';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { PhoneEnabled as Phone, Mail } from '@mui/icons-material/';
import { HTTPVerb, request } from '../apiClient';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import AvatarCheckBox from '../MainGrid/MainGrid.AvatarCheckBox';
import MainGrid, { GridProps } from '../MainGrid/MainGrid.Grid';
import CreateEditDlg, { ShowCreateEditProps } from './Contacts.CreateEdit';
import ActionButton from '../MainGrid/MainGrid.ActionButton';

export default function Contacts() {

    const { showModal } = useModal();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [gridState, setGridState] = useState<GridProps>({
        title: 'Contact',
        titlePlural: 'Contacts',
        searchQuery: '',
        searchChanged: false,
        rows: [],
        columns: [],
        loading: true,
        deleteIds: [],
        page: 1,
        rowCount: 10,
        rowsPerPage: isMobile ? 20 : 10,
        pageCount: 10,
    });

    useEffect(() => {
        if (!gridState.loading) {
            return;
        }
        let method: HTTPVerb = 'GET';
        let endpoint = '/contacts';

        if (gridState.deleteIds.length) {
            endpoint += '/' + gridState.deleteIds.join(',');
            method = 'DELETE';
        }

        request(method, endpoint, {
            sortBy: 'id',
            sortDirection: 'desc',
            limit: gridState.rowsPerPage,
            search: gridState.searchQuery,
            page: gridState.page,
        })
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
                    page: res.data.current_page ?? 1,
                    rowCount: res.data.total ?? 0,
                    rows: res.data.data ?? [],
                    pageCount: Math.ceil(res.data.total / gridState.rowsPerPage),
                    loading: false,
                    deleteIds: [],
                    searchChanged: false,
                });
            })
            .catch((error) => {
                setGridState({
                    ...gridState,
                    deleteIds: [],
                    rows: [],
                    loading: false
                });
            });
    }, [gridState]);

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
        if (newPage !== gridState.page) {
            setGridState({
                ...gridState,
                page: newPage,
                loading: true,
            });
        }
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

    const showCreateEditDlg = (props?: ShowCreateEditProps) => {
        const type = (!props?.contactId) ? 'new' : 'edit';

        const dlg = showModal(CreateEditDlg, {
            type: type,
            data: props,
            onCancel: () => {
                dlg.destroy();
            },
            onSave: () => {
                dlg.destroy();
            },
        });
    };

    const onClickContact = (e: React.MouseEvent, rowData: GridRowModel) => {
        e.preventDefault();
        showCreateEditDlg({
            contactId: rowData.id,
            fullname: rowData.fullname,
        });
    };

    let columns: GridColDef[] = [
        AvatarCheckBox,
        {
            field: 'fullname',
            headerName: 'Name',
            width: 180,
            renderCell: (params: GridRenderCellParams<string>) => {
                return (
                    <Link href="" onClick={(e) => { onClickContact(e, params.row) }}>
                        {params.value}
                    </Link>
                );
            }
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 410,
            cellClassName: 'allowWrap',
            valueGetter: (params: any) => {
                return params.row?.address?.[0]?.full_address ?? '';
            }
        },
        {
            field: 'phone_number',
            headerName: 'Phone Number',
            width: 130,
            valueGetter: (params: any) => {
                return params.row?.phone_number?.[0]?.number ?? '';
            }
        },
        {
            field: 'email_address',
            headerName: 'Email Address',
            width: 220,
            valueGetter: (params: any) => {
                return params.row?.email_address?.[0]?.address ?? '';
            }
        }
    ];

    if (isMobile) {

        const onClick = (action: string, rowData: GridRowModel) => {
            console.log(rowData);
        }

        columns = [
            columns[0],
            {
                ...columns[1],
                flex: 1,
            },
            {
                field: 'action',
                headerName: '',
                renderCell: (params) => {
                    return (
                        <Box display="flex" gap={2}>
                            <ActionButton
                                name="phone"
                                rowData={params.row}
                                onClick={onClick}
                            >
                                <Phone sx={{ color: '#009688' }} />
                            </ActionButton>
                            <ActionButton
                                name="mail"
                                rowData={params.row}
                                onClick={onClick}
                            >
                                <Mail sx={{ color: '#2196f3' }} />
                            </ActionButton>
                        </Box>
                    );
                }
            }
        ]
    }



    return (
        <MainGrid
            {...gridState}
            columns={columns}
            onSearch={onSearch}
            onCreateClick={showCreateEditDlg}
            onPageChange={onPageChange}
            onDelete={onDelete}
            onRefreshClick={onRefreshClick}
            showPagination={!isMobile}
        />
    );
}
