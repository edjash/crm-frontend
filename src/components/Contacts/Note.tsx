import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, Paper, SxProps } from "@mui/material";
import clsx from "clsx";
import { useModal } from 'mui-modal-provider';
import { useEffect, useRef, useState } from "react";
import apiClient from '../apiClient';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import HiddenField from '../Form/HiddenField';
import TextFieldEx from '../Form/TextFieldEx';

interface NoteProps {
    contactType: 'contact' | 'company';
    contactId: number;
    content: string;
    noteId?: number;
    onClose?: () => void;
    onNoteSaved: (noteData: {}) => void;
    onNoteDeleted: () => void;
    embed?: boolean;
    sx?: SxProps;
}

interface NoteState {
    noteId?: number;
    unsaved: boolean;
    saving: boolean;
    deleting: boolean;
    noteContent: string;
}

export default function Note(props: NoteProps) {

    console.log("INIT", props.noteId);

    const [state, setState] = useState<NoteState>({
        noteId: props.noteId,
        unsaved: false,
        saving: false,
        deleting: false,
        noteContent: '',
    });

    const { showModal } = useModal();
    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (state.noteId !== props.noteId) {
            setState(state => ({
                ...state,
                noteId: props.noteId,
                noteContent: props.content,
            }));
        }
    }, [
        state.noteId,
        props.noteId,
        props.content,
    ]);

    // useEffect(() => {
    //     console.log("NOTEID", props.noteId);
    //     if (!props.open) {
    //         setState(state => ({
    //             ...state,
    //             unsaved: false,
    //             noteId: props.noteId,
    //         }));
    //     } else {
    //         setState(state => ({
    //             ...state,
    //             noteId: props.noteId
    //         }));
    //     }

    // }, [
    //     props.open,
    //     props.noteId,
    // ]);

    const focusInputField = (input: HTMLInputElement | null) => {
        if (input) {
            inputRef.current = input;
            setTimeout(() => {
                input.focus()
                input.selectionStart = input.value.length;
                input.selectionEnd = input.value.length;
            }, 100);
        }
    };

    const onDeleteClick = () => {

        const confirm = showModal(ConfirmDialog, {
            title: 'Confirm',
            content: "Delete Note?",
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            onCancel: () => {
                confirm.hide();
            },
            onConfirm: () => {
                confirm.hide();

                setState(state => ({
                    ...state,
                    unsaved: false,
                    deleting: true,
                    noteId: undefined,
                }));

                let url = '/notes';
                if (state.noteId) {
                    url = `${url}/${state.noteId}`;
                }

                apiClient.delete(url).then((response) => {
                    setState(state => ({
                        ...state,
                        unsaved: false,
                        saving: false,
                        deleting: false,
                    }));

                    if (props.onNoteDeleted) {
                        props.onNoteDeleted();
                    }
                });
            },
        });
    }

    const onSave = () => {

        setState(state => ({
            ...state,
            saving: true,
        }));

        const data = {
            content: inputRef.current?.value ?? '',
            contactType: props.contactType,
            contactId: props.contactId,
        };
        let url = '/notes';
        if (state.noteId) {
            url = `${url}/${state.noteId}`;
        }
        apiClient.post(url, data).then((response) => {
            setState(state => ({
                ...state,
                unsaved: false,
                saving: false,
            }));

            if (props.onNoteSaved) {
                props.onNoteSaved(response.data);
            }
        });
    }

    return (
        <Paper
            variant="outlined"
            square
            className={clsx({
                'note': true,
            })}
            sx={{
                ...props.sx,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {!props.embed &&
                <div>
                    <Box fontSize="small"
                        p={1}
                        pl={2}
                        display="flex"
                        gap={1}
                        alignItems="center"
                        sx={{ backgroundColor: 'toolbar.backgroundColor' }}
                    >
                        <Button
                            variant="text"
                            onClick={props.onClose}
                            size="small"
                            sx={{ color: "toolbar.buttonTextColor" }}
                            startIcon={<ArrowBackIcon fontSize="small" />}
                            disabled={state.saving || state.deleting}
                        >
                            Back
                        </Button>
                        {!state.saving ?
                            <Button
                                size="small"
                                variant="text"
                                startIcon={<SaveIcon fontSize="small" />}
                                disabled={!state.unsaved}
                                sx={{ color: "toolbar.buttonTextColor" }}
                                onClick={onSave}
                            >
                                Save
                            </Button>
                            :
                            <Box fontSize="small" display="flex" gap={1}>
                                <CircularProgress size={16} />
                                <div>Saving...</div>
                            </Box>
                        }
                        <div style={{ flexGrow: 1 }} />
                        {!state.deleting ?
                            <Button
                                size="small"
                                variant="text"
                                onClick={onDeleteClick}
                                sx={{ color: "toolbar.buttonTextColor" }}
                                startIcon={<DeleteIcon fontSize="small" />}
                                disabled={state.saving || !state.noteId}
                            >
                                Delete
                            </Button>
                            :
                            <Box fontSize="small" display="flex" gap={1}>
                                <CircularProgress size={16} />
                                <div>Deleting...</div>
                            </Box>
                        }
                    </Box>
                </div>
            }
            <HiddenField name="noteUnsaved" value={state.unsaved} />
            <HiddenField name="noteId" value={props.noteId} />
            <Box
                className="noteInputContainer"
            >
                <TextFieldEx
                    multiline
                    sx={{ height: '100%' }}
                    inputRef={focusInputField}
                    onChange={() => {
                        if (!state.unsaved) {
                            setState(state => ({
                                ...state,
                                unsaved: true,
                            }));
                        }
                    }}
                    InputProps={{
                        sx: {
                            pt: 1,
                            height: '100%',
                            alignItems: 'flex-start',
                        }
                    }}
                    defaultValue={props.content}
                />
            </Box>
        </Paper >
    );
}