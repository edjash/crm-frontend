import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, Paper, SxProps, TextField } from "@mui/material";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import apiClient from '../apiClient';

interface NoteProps {
    contactType: 'contact' | 'company';
    open?: boolean;
    content?: string;
    noteId?: number;
    onClose?: () => void;
    onNoteSaved: (noteData: {}) => void;
    embed?: boolean;
    sx?: SxProps;
}

export default function Note(props: NoteProps) {


    const [state, setState] = useState({
        saveDisabled: true,
        saving: false,
    });

    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (!props.open) {
            setState(state => ({
                ...state,
                saveDisabled: true,
            }));
        }
    }, [props.open]);

    if (!props.open) {
        return <></>;
    }

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

    const onSave = () => {

        setState(state => ({
            ...state,
            saving: true,
        }));

        const data = {
            content: inputRef.current?.value ?? '',
            contactType: props.contactType,
        };
        let url = '/notes';
        if (props.noteId) {
            url = `${url}/${props.noteId}`;
        }
        apiClient.post(url, data).then((response) => {
            setState(state => ({
                ...state,
                saveDisabled: true,
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
                display: (props.open) ? 'flex' : 'none',
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
                            disabled={state.saving}
                        >
                            Back
                        </Button>
                        {!state.saving ?
                            <Button
                                size="small"
                                variant="text"
                                startIcon={<SaveIcon fontSize="small" />}
                                disabled={state.saveDisabled}
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
                        <Button
                            size="small"
                            variant="text"
                            onClick={props.onClose}
                            sx={{ color: "toolbar.buttonTextColor" }}
                            startIcon={<DeleteIcon fontSize="small" />}
                            disabled={state.saving}
                        >
                            Delete
                        </Button>
                    </Box>
                </div>
            }
            <Box
                sx={{
                    height: '100%',
                    p: 2,
                    pt: 1,
                    pb: 3,
                }}
            >
                <TextField
                    multiline
                    sx={{ height: '100%' }}
                    inputRef={focusInputField}
                    onChange={() => {
                        setState(state => ({
                            ...state,
                            saveDisabled: false,
                        }));
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