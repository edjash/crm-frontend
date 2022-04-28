import { Avatar, Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import { useModal } from 'mui-modal-provider';
import { MouseEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { EVENTS, SERVER_URL } from '../../app/constants';
import apiClient from '../apiClient';
import ViewEditAvatarDialog from '../Dialogs/ViewEditAvatarDialog';
import Overlay from '../Overlay';
import ProgressiveImage from "../ProgressiveImage";

interface ProfileAvatarProps extends BoxProps {
    name: string;
    alt?: string;
    src?: string;
    defaultValue?: string;
    onChange?: (event: any) => void;
    size?: number;
}

interface ProfileAvatarState {
    showMask: boolean;
    progressPercent: number;
    uploading: boolean;
    filename: string;
}

export default function ProfileAvatar(props: ProfileAvatarProps) {

    const { setValue, getValues } = useFormContext();
    const avatarSize = props.size ?? 64;

    const { showModal } = useModal();
    const [state, setState] = useState<ProfileAvatarState>(() => {
        let filename = getValues(props.name) ?? '';
        return {
            showMask: false,
            progressPercent: 0,
            uploading: false,
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
        let percent = Math.ceil((pe.loaded * 100) / pe.total);
        setState(state => ({
            ...state,
            progressPercent: percent,
        }));
    }

    const DeleteAvatar = () => {
        setValue(props.name, '');

        setState((state) => ({
            ...state,
            src: null,
            filename: '',
        }));
    }

    const UploadAvatar = (fileObject: File) => {

        setState((state) => ({
            ...state,
            progressPercent: 0,
            fileObject: fileObject,
            uploading: true,
            showMask: true,
        }))

        var formData = new FormData();
        formData.append(props.name, fileObject);

        const config: AxiosRequestConfig = {
            onUploadProgress: onUploadProgress,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        setState(state => ({ ...state, uploading: true, progressPercent: 0 }));

        apiClient.post('/contacts/avatar', formData, config).then((response) => {
            if (response.data.filename) {

                const src = (fileObject) ? URL.createObjectURL(fileObject) : null;
                setState(state => ({
                    ...state,
                    showMask: false,
                    uploading: false,
                    progressPercent: 0,
                    filename: response.data.filename,
                    src: src,
                }));

                setValue(props.name, response.data.filename);
            }
        }).catch((error) => {
            if (error?.data?.errors?.avatar) {
                PubSub.publish(EVENTS.TOAST, {
                    autoHide: false,
                    message: "There was a problem updating the avatar:",
                    list: error.data.errors.avatar,
                    type: 'error',
                });
            } else {
                PubSub.publish(EVENTS.TOAST, {
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
    }

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
                width={avatarSize}
                height={avatarSize}
            >
                {state.filename ?
                    <ProgressiveImage
                        src={`${SERVER_URL}/storage/avatars/medium/${state.filename}`}
                        //The small image should already be cached as it is used in the contact list.
                        //If you are testing with cache disabled then this effect will be broken.
                        placeholderSrc={`${SERVER_URL}/storage/avatars/small/${state.filename}`}
                        width={avatarSize}
                        height={avatarSize}
                        containerSx={{
                            borderRadius: '10px'
                        }}
                        onMouseOver={onMouseOver}
                        onMouseLeave={onMouseLeave}
                        showIndicator={false}

                    /> :
                    <Avatar
                        sx={{ borderRadius: '10px', width: avatarSize, height: avatarSize, color: 'inherit' }}
                        onMouseOver={onMouseOver}
                        onMouseLeave={onMouseLeave}
                    />
                }
                <Overlay
                    open={state.showMask}
                    useAbsolute
                    sx={{ borderRadius: '10px', textAlign: "center", cursor: 'pointer' }}
                    backdropProps={{
                        open: state?.showMask,
                        onMouseOver: onMouseOver,
                        onMouseLeave: onMouseLeave,
                        onClick: () => {
                            const dlg = showModal(ViewEditAvatarDialog, {
                                title: 'Contact Photo',
                                filename: state.filename,
                                onFileAccepted: (file: File) => {
                                    dlg.destroy();
                                    UploadAvatar(file);
                                },
                                onDelete: () => {
                                    dlg.destroy();
                                    DeleteAvatar();
                                }
                            });
                        }
                    }}
                >
                    {state.uploading &&
                        <Box sx={{ position: 'relative', display: 'inline-flex' }} >
                            <CircularProgress
                                variant="determinate"
                                value={state.progressPercent}
                                size={avatarSize}
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
            </Box>
        </Box>
    );
}
