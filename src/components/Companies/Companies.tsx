import { Mail, PhoneEnabled as Phone } from '@mui/icons-material/';
import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, Link, Theme, useMediaQuery } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowId, GridRowModel } from '@mui/x-data-grid';
import { useModal } from 'mui-modal-provider';
import PubSub from 'pubsub-js';
import { useEffect, useRef, useState } from 'react';
import { HTTPVerb, request } from '../apiClient';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import AvatarCheckBox from '../MainGrid/MainGrid.AvatarCheckBox';
import MainGrid from '../MainGrid/MainGrid.Grid';
import PullRefresh from '../PullRefresh';
import CreateEditDlg, { ShowCreateEditProps } from './Companies.CreateEdit';

export default function Companies() {

    const { showModal } = useModal();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const scrollRef = useRef<HTMLElement>();
    const onRefreshed = useRef<() => void>(() => { });

    const [gridState, setGridState] = useState({
        title: 'Company',
        titlePlural: 'Companies',
        searchQuery: '',
        searchChanged: false,
        rows: [] as GridRowModel[],
        columns: [],
        loading: true,
        deleteIds: [] as GridRowId[],
        page: 1,
        rowCount: 0,
        rowsPerPage: isMobile ? 20 : 20,
        pageCount: 10,
        pullRefreshEnabled: false,
    });

    const setContainerRef = (container: HTMLDivElement | null) => {
        if (container && !scrollRef.current) {
            const scrollEl = container.querySelector('div.MuiDataGrid-virtualScroller');
            if (scrollEl) {
                scrollRef.current = scrollEl as HTMLDivElement;
                setGridState(state => ({
                    ...state,
                    pullRefreshEnabled: true,
                }));
            }
        }
    }

    useEffect(() => {
        const s1 = PubSub.subscribe('COMPANIES.REFRESH', (msg, callback?: () => void) => {
            console.log(callback);
            const fn = () => { };
            onRefreshed.current = callback ?? fn;
            setGridState((state) => ({
                ...state,
                loading: true,
            }));
        });
        return () => {
            PubSub.unsubscribe(s1);
        }
    }, []);

    useEffect(() => {
        if (!gridState.loading) {
            return;
        }
        let method: HTTPVerb = 'GET';
        let endpoint = '/companies';

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
                    setGridState(state => ({
                        ...state,
                        deleteIds: [],
                        page: res.data.last_page
                    }));
                    return;
                }

                setGridState(state => ({
                    ...state,
                    page: res.data.current_page ?? 1,
                    rowCount: res.data.total ?? 0,
                    rows: res.data.data ?? [],
                    pageCount: Math.ceil(res.data.total / gridState.rowsPerPage),
                    loading: false,
                    deleteIds: [],
                    searchChanged: false,
                }));
            })
            .catch((error) => {
                setGridState(state => ({
                    ...state,
                    deleteIds: [],
                    rows: [],
                    loading: false
                }));
            }).finally(() => {
                if (onRefreshed.current) {
                    onRefreshed.current();
                }
            });
    }, [gridState]);

    const onDelete = (rowIds: GridRowId[]) => {

        const dialogContent: JSX.Element[] = [
            <span key="0">
                The following companies will be deleted:
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

    const onRefresh = (callback = () => { }) => {
        PubSub.publish('COMPANIES.REFRESH', callback);
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

    const onFabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        showCreateEditDlg();
    }

    const onClickContact = (e: React.MouseEvent, rowData: GridRowModel) => {
        e.preventDefault();
        showCreateEditDlg({
            contactId: rowData.id,
            name: rowData.name,
        });
    };

    let columns: GridColDef[] = [
        AvatarCheckBox,
        {
            field: 'name',
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
                    let number = params.row?.phone_number?.[0]?.number;
                    if (number) {
                        number = `tel:${number}`;
                    }
                    let email = params.row?.email_address?.[0]?.address;
                    if (email) {
                        email = `mailto:${email}`;
                    }
                    return (
                        <Box display="flex" gap={3}>
                            {number ?
                                <Link href={number}>
                                    <Phone />
                                </Link>
                                :
                                <Phone sx={{ color: 'custom.disabledIcon' }} />
                            }
                            {email ?
                                <Link href={email}>
                                    <Mail />
                                </Link>
                                :
                                <Mail sx={{ color: 'custom.disabledIcon' }} />
                            }
                        </Box>
                    );
                }
            }
        ]
    }

    return (
        <Box display="grid">
            <MainGrid
                {...gridState}
                containerRef={setContainerRef}
                columns={columns}
                onSearch={onSearch}
                onCreateClick={showCreateEditDlg}
                onPageChange={onPageChange}
                onDelete={onDelete}
                onRefreshClick={onRefresh}
                showPagination={!isMobile}
            />
            {isMobile &&
                <Fab
                    aria-label="add"
                    onClick={onFabClick}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        color: 'primary.light'
                    }}>
                    <AddIcon sx={{ color: '#000000' }} />
                </Fab>
            }
            {isMobile &&
                <PullRefresh
                    onRefresh={onRefresh}
                    enabled={gridState.pullRefreshEnabled}
                    scrollElement={scrollRef.current}
                />
            }
        </Box>
    );
}
