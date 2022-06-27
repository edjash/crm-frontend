import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Paper, TablePagination } from "@mui/material";
import {
    DataGrid,
    GridCallbackDetails, GridColumns,
    GridRenderCellParams,
    GridRowData,
    GridRowParams
} from "@mui/x-data-grid";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { EVENTS } from '../../app/constants';
import apiClient from "../apiClient";
import TabPanel from "../TabPanel";
import Note from './Note';

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
    contactId: number;
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
            noteContent: content,
            noteId: id,
            showNote: true,
        }));
    }

    const onAddClick = () => {
        setState(state => ({
            ...state,
            noteId: undefined,
            noteContent: 'test',
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

    const onNoteDeleted = () => {
        PubSub.publish(EVENTS.TOAST, "Note Deleted");

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
                    className="dialogGrid notesGrid"
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
                        onNoteClick(params.row.id, params.row.content ?? '');
                    }}
                    components={{
                        Footer: GridFooter,
                        NoRowsOverlay: () => (
                            <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                                No notes
                            </Box>
                        )
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
            {state.showNote &&
                <Note
                    contactType={props.contactType}
                    contactId={props.contactId}
                    content={state.noteContent}
                    noteId={state.noteId}
                    onClose={onCloseClick}
                    onNoteSaved={onNoteSaved}
                    onNoteDeleted={onNoteDeleted}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }}
                />
            }
        </TabPanel >
    );
}
