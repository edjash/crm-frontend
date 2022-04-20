import { Edit } from '@mui/icons-material/';
import { Avatar, Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import { uniqueId } from 'lodash';
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { SERVER_URL } from '../../app/constants';
import apiClient from '../apiClient';
import Overlay from '../Overlay';

interface ProfileAvatarProps extends BoxProps {
    name: string;
    alt?: string;
    src?: string;
    defaultValue?: string;
    onAvatarChange: (filename: string) => void;
}

interface ProfileAvatarState {
    showMask: boolean;
    progressPercent: number;
    uploading: boolean;
    fileObject: File | null;
    src: string | null;
    filename: string;
    fieldId: string;
}

export default function ProfileAvatar(props: ProfileAvatarProps) {

    const acceptType = ['.jpg', '.jpeg', '.png', '.gif'];

    const [state, setState] = useState<ProfileAvatarState>(() => {
        let filename = props.src ?? '';
        let src = null;

        if (filename) {
            src = `${SERVER_URL}/storage/avatars/medium/${filename}`;
        }

        return {
            showMask: false,
            progressPercent: 0,
            uploading: false,
            fileObject: null,
            src: src,
            filename: filename,
            fieldId: uniqueId('avatarUpload_'),
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
        let percent = Math.ceil((pe.loaded * 100) / pe.total);
        setState(state => ({
            ...state,
            progressPercent: percent,
        }));
    }

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (!files || !files.length) {
            return;
        }
        const file: File = files[0];
        const ext = '.' + (file.name ?? '').toLowerCase().split('.').pop();
        if (acceptType.indexOf(ext ?? '') < 0) {
            PubSub.publish('TOAST.SHOW', {
                type: 'error',
                autoHide: false,
                message: 'Only images of the following type are allowed: ' +
                    acceptType.join(', ')
            });
            return;
        }

        setState((state) => ({
            ...state,
            progressPercent: 0,
            fileObject: file,
            uploading: true,
        }));

    }

    const onDeleteAvatarClick = () => {
        setState((state) => ({
            ...state,
            src: null,
            filename: '',
        }));
    }

    useEffect(() => {
        if (!state.uploading || !state.fileObject) {
            return;
        }

        var formData = new FormData();
        formData.append(props.name, state.fileObject);

        const config: AxiosRequestConfig = {
            onUploadProgress: onUploadProgress,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        setState(state => ({ ...state, uploading: true, progressPercent: 0 }));

        apiClient.post('/contacts/avatar', formData, config).then((response) => {
            if (response.data.filename) {
                const src = (state.fileObject) ? URL.createObjectURL(state.fileObject) : null;
                setState(state => ({
                    ...state,
                    showMask: false,
                    uploading: false,
                    progressPercent: 0,
                    filename: response.data.filename,
                    src: src,
                }));
                if (props.onAvatarChange) {
                    props.onAvatarChange(response.data.filename);
                }
            }
        }).catch((error) => {
            if (error?.data?.errors?.avatar) {
                PubSub.publish('TOAST.SHOW', {
                    autoHide: false,
                    message: "There was a problem updating the avatar:",
                    list: error.data.errors.avatar,
                    type: 'error',
                });
            } else {
                PubSub.publish('TOAST.SHOW', {
                    autoHide: false,
                    message: "An error occured uploading the avatar. Please try again.",
                    type: 'error',
                });
            }
            setState(state => ({
                ...state,
                showMask: false,
                uploading: false,
                progressPercent: 0,
            }));
        });

    }, [
        state.uploading,
        state.fileObject,
        props.name,
    ]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            sx={{
                '&:hover': {
                    '& .AvatarControlIcons': { display: 'grid' }
                }
            }}
        >
            <Box
                position="relative"
                width={48}
                height={48}
            >
                <Avatar
                    alt={props.alt}
                    src={state.src || undefined}
                    sx={{ width: 48, height: 48, color: '#e0e0e0' }}
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
                        <label htmlFor={state.fieldId} style={{
                            cursor: 'pointer',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Edit fontSize="inherit" />
                        </label>
                        :
                        <Box sx={{ position: 'relative', display: 'inline-flex' }} >
                            <CircularProgress
                                variant="determinate"
                                value={state.progressPercent}
                                size={48}
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
                    id={state.fieldId}
                    accept={acceptType.join(',')}
                    style={{ display: "none" }}
                    onChange={onFileInputChange}
                />
            </Box>
            {/* {!state.uploading &&
                <Box
                    className="AvatarControlIcons"
                    sx={{ position: 'absolute', top: 0, right: 3, display: 'grid' }}
                >
                    <IconButton size="small" className="formIconButton" onClick={onDeleteAvatarClick}>
                        <Delete fontSize="inherit" />
                    </IconButton>
                </Box>
            } */}
        </Box>
    );
}
