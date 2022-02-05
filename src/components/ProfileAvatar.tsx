import { Avatar, Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import apiClient from './apiClient';
import Overlay from './Overlay';

interface ProfileAvatarProps extends BoxProps {
    name: string;
    alt?: string;
    src?: string;
    postEndPoint?: string;
    postData?: Record<string, string>;
    defaultValue?: string;
}

interface ProfileAvatarState {
    showMask: boolean;
    progressPercent: number;
    uploading: boolean;
    fileObject: File | null;
    src: string | null;
    filename: string;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function (props: ProfileAvatarProps) {

    const [state, setState] = useState<ProfileAvatarState>(() => {
        let filename = props?.defaultValue ?? '';
        let src = null;
        if (props.defaultValue) {
            src = `${SERVER_URL}/storage/avatars/${filename}`;
        }

        return {
            showMask: false,
            progressPercent: 0,
            uploading: false,
            fileObject: null,
            src: src,
            filename: filename,
        };
    });

    const onMouseOver = (e: MouseEvent<HTMLDivElement>) => {
        setState({
            ...state,
            showMask: true,
        })
    }

    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        setState({
            ...state,
            showMask: false,
        })
    }

    const onUploadProgress = (pe: ProgressEvent) => {
        const percent = Math.round((pe.loaded * 100) / pe.total);
        setState(state => ({ ...state, progressPercent: percent }));
    }

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (!files || !files.length) {
            return;
        }

        if (!props.postEndPoint) {
            return;
        }

        setState((state) => ({
            ...state,
            progressPercent: 0,
            fileObject: files[0],
            uploading: true,
        }));
    }

    useEffect(() => {
        if (!state.uploading || !state.fileObject || !props.postEndPoint) {
            return;
        }

        var formData = new FormData();
        formData.append(props.name, state.fileObject);

        const config: AxiosRequestConfig = {
            onUploadProgress: onUploadProgress
        }

        setState(state => ({ ...state, uploading: true, progressPercent: 0 }));

        apiClient.postForm(props.postEndPoint, formData, true, config).then((response) => {
            if (response.data.filename) {
                const src = `${SERVER_URL}/storage/tmp_avatars/${response.data.filename}`;

                setState(state => ({
                    ...state,
                    showMask: false,
                    uploading: false,
                    progressPercent: 0,
                    filename: response.data.filename,
                    src: src,
                }));
            }
        }).catch((error) => {
            PubSub.publish('TOAST.SHOW', {
                autoHide: false,
                message: "An error occured uploading the file.",
                list: error?.data?.errors?.avatar ?? [],
                type: 'error',
            });

            setState(state => ({
                ...state,
                showMask: false,
                uploading: false,
                progressPercent: 0,
            }));
        });

    }, [state.uploading]);

    return (
        <Box
            position="relative"
            width={100}
            height={100}
            sx={props.sx}
        >
            <Avatar
                alt={props.alt}
                src={state.src || undefined}
                sx={{ width: 100, height: 100, color: '#e0e0e0' }}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
            />
            <Overlay
                open={state.showMask}
                useAbsolute
                sx={{ borderRadius: "50%", textAlign: "center", cursor: 'pointer' }}
                backdropProps={{
                    open: state?.showMask,
                    onMouseOver: onMouseOver,
                    onMouseLeave: onMouseLeave,
                }}
            >
                {!state.uploading ?
                    <label htmlFor="fileElem" style={{
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                        display: 'table',
                    }}>
                        <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                            Change Photo
                        </span>
                    </label>
                    :
                    <Box sx={{ position: 'relative', display: 'inline-flex' }} >
                        <CircularProgress
                            variant="determinate"
                            value={state.progressPercent}
                            size={100}
                        />
                        <Box sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Typography
                                variant="h6"
                                component="div"
                                color="text.secondary"
                            >
                                {`${state.progressPercent}%`}
                            </Typography>
                        </Box>
                    </Box>
                }
            </Overlay >
            <input
                type="file"
                id="fileElem"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileInputChange}
            />
            <input type="hidden" name={props.name} defaultValue={state.filename} />
        </Box >
    );
}