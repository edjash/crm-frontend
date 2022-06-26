import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Paper, TablePagination } from "@mui/material";
import {
    DataGrid,
    GridCallbackDetails,
    GridCellParams,
    GridColumns,
    GridRenderCellParams,
    GridRowData,
    GridRowParams
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import TabPanel from "../TabPanel";
import dateFormat from "dateformat";
import Note from './Note';
import { EVENTS } from '../../app/constants';

function truncateLine(line: string, maxLen: number): string {
    if (line.length < maxLen) {
        return line;
    }
    line = line.substring(0, maxLen);
    return `${line} ...`;
}

const ColDef: GridColumns = [
    {
        field: 'updated_at',
        headerName: 'Date / Time',
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<string>) => {
            let d = new Date(params?.value ?? '');
            const timestr = dateFormat(d, 'H:MM');
            const datestr = dateFormat(d, 'mmm dS, yyyy');

            return (
                <>
                    {timestr}<br />
                    {datestr}
                </>
            );
        }
    },
    {
        field: 'content',
        headerName: 'Note',
        flex: 1,
        sortable: false,
        cellClassName: 'grid-note-preview',
        renderCell: (params: GridRenderCellParams) => {
            return truncateLine(params.value, 200);
        },
    }
];

const onSelectionChange = () => {

}

interface GridFooterProps {
    onAddClick: () => void;
    paginationProps: {
        count: number;
        page: number;
        rowsPerPage: number;
        onPageChange: (page: number) => void;
    }
}

const GridFooter = (props: GridFooterProps) => {

    const pageProps = props.paginationProps;

    return (
        <Box display="flex">
            <Button
                startIcon={<AddIcon />}
                onClick={props.onAddClick}
            >
                Add Note
            </Button>
            <div style={{ flexGrow: 1 }} />
            {(pageProps.count > 0 && pageProps.count > pageProps.rowsPerPage) &&
                <TablePagination
                    {...pageProps}
                    component='div'
                    onPageChange={(event, page) => {
                        if (pageProps.onPageChange) {
                            pageProps.onPageChange(page + 1);
                        }
                    }}
                    rowsPerPageOptions={[]}
                />
            }
        </Box>
    )
}

interface NotesTabProps {
    value: number;
    isActive: boolean;
    contactId?: number;
    contactType: 'contact' | 'company';
}

interface NotesTabState {
    loadGrid: boolean;
    rowData: GridRowData[];
    rowCount: number;
    page: number;
    showNote: boolean;
    noteContent: string;
    noteId?: number;
}

export default function NotesTab(props: NotesTabProps) {

    const rowsPerPage = 20;

    const [state, setState] = useState<NotesTabState>({
        loadGrid: true,
        rowData: [],
        rowCount: 0,
        page: 1,
        showNote: false,
        noteContent: '',
        noteId: undefined,
    });

    useEffect(() => {
        if (state.loadGrid) {
            apiClient.get(`/notes/contact/${props.contactId}`, {
                sortBy: 'id',
                sortDirection: 'desc',
                limit: rowsPerPage,
                page: state.page,
            }).then((response) => {

                setState((state) => ({
                    ...state,
                    loadGrid: false,
                    rowData: response?.data?.data ?? [],
                    rowCount: response?.data?.total ?? 0,
                }));
            });
        }
    }, [
        state.loadGrid,
        state.page,
        props.contactId
    ]);

    const onNoteClick = (id: number, content: string) => {
        setState(state => ({
            ...state,
            showNote: true,
            noteContent: content,
            noteId: id,
        }));
    }

    const onAddClick = () => {
        setState(state => ({
            ...state,
            showNote: true
        }));
    }

    const onCloseClick = () => {
        setState(state => ({
            ...state,
            showNote: false
        }));
    }

    const onNoteSaved = (noteData: {}) => {

        PubSub.publish(EVENTS.TOAST, "Note Saved");

        setState(state => ({
            ...state,
            showNote: false,
            loadGrid: true,
        }));
    }

    return (
        <TabPanel
            value={props.value}
            isActive={props.isActive}
            sx={{
                width: '100%',
                position: 'relative',
                height: '100%'
            }}
        >
            <Paper
                className='dialogPaper'
                sx={{
                    height: '100%',
                    display: 'flex'
                }}>
                <DataGrid
                    className="notesGrid"
                    columns={ColDef}
                    rows={state.rowData}
                    pagination
                    paginationMode="server"
                    rowCount={0}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector={true}
                    onSelectionModelChange={onSelectionChange}
                    rowHeight={100}
                    onRowClick={(
                        params: GridRowParams,
                        event: React.MouseEvent,
                        details: GridCallbackDetails) => {
                        onNoteClick(params.row.id, params.row.content);
                    }}
                    components={{
                        Footer: GridFooter,
                    }}
                    componentsProps={{
                        footer: {
                            onAddClick: onAddClick,
                            paginationProps: {
                                count: state.rowCount,
                                page: state.page - 1,
                                rowsPerPage: rowsPerPage,
                                onPageChange: (page: number) => {
                                    setState(state => ({
                                        ...state,
                                        page: page,
                                        loadGrid: true,
                                    }));
                                }
                            }
                        }
                    }}
                    sx={{
                        flexGrow: 1
                    }}
                />
            </Paper>
            <Note
                open={state.showNote}
                contactType={props.contactType}
                content={state.noteContent}
                noteId={state.noteId}
                onClose={onCloseClick}
                onNoteSaved={onNoteSaved}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }}
            />
        </TabPanel >
    );
}
