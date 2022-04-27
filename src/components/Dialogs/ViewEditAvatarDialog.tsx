import { Delete, Upload } from '@mui/icons-material/';
import { Avatar, Box, Button, ButtonProps, Theme, useMediaQuery } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import { ChangeEvent } from 'react';
import { EVENTS } from '../../app/constants';
import ConfirmDialog from './ConfirmDialog';
import DialogEx from './DialogEx';

interface ViewEditAvatarDialogProps {
    title?: string;
    imageUrl: string;
    open: boolean;
    onDelete: () => void;
    onFileAccepted: (file: File) => void;
};

interface FileUploadButtonProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    acceptTypes: string[];
    buttonProps?: ButtonProps;
}

const FileUploadButton = (props: FileUploadButtonProps) => {
    return (
        <label htmlFor="avatar-file">
            <input
                type="file"
                id='avatar-file'
                accept={props.acceptTypes.join(',')}
                style={{ width: 0, height: 0 }}
                onChange={props.onChange}
            />
            <Button
                startIcon={<Upload />}
                component="span"
                {...props.buttonProps}
            >
                Upload
            </Button>
        </label>
    );
}

export default function ViewEditAvatarDialog(props: ViewEditAvatarDialogProps) {

    const { showModal } = useModal();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const acceptTypes = ['.jpg', '.jpeg', '.png', '.gif'];

    const onDelete = () => {
        const confirm = showModal(ConfirmDialog, {
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this photo?',
            confirmButtonText: 'Delete',
            onCancel: () => {
                confirm.hide();
            },
            onConfirm: () => {
                if (props.onDelete) {
                    props.onDelete();
                }
                confirm.hide();
            },
        });
    }

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (!files || !files.length) {
            return;
        }
        const file: File = files[0];
        const ext = '.' + (file.name ?? '').toLowerCase().split('.').pop();
        if (acceptTypes.indexOf(ext ?? '') < 0) {
            PubSub.publish(EVENTS.TOAST, {
                type: 'error',
                autoHide: false,
                message: 'Only images of the following type are allowed: ' +
                    acceptTypes.join(', ')
            });
            return;
        }

        if (props.onFileAccepted) {
            props.onFileAccepted(file);
        }
    }

    return (
        <DialogEx
            open={true}
            displayMode={isMobile ? 'mobile' : 'normal'}
            hideSaveButton={isMobile ? true : false}
            disableRestoreFocus={true}
            title={props.title}
            titleProps={{
                className: "customDialogTitle"
            }}
            contentProps={{
                dividers: true,
                sx: {
                    overflow: 'hidden',
                    p: 0,
                    pt: 1,
                    display: 'block',
                }
            }}
            hideActionButtons={true}
        >
            <Box display="flex" flexDirection="column" justifyContent="flex-start" gap={1}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 4,
                    mb: 1,
                    order: 2
                }}>
                    {props.imageUrl &&
                        <Button
                            onClick={onDelete}
                            startIcon={<Delete />}
                            size="medium"
                            variant="outlined"
                        >
                            Delete
                        </Button>
                    }
                    <FileUploadButton
                        onChange={onFileInputChange}
                        acceptTypes={acceptTypes}
                        buttonProps={{
                            size: "medium",
                            variant: "outlined"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundImage: (props.imageUrl) ? `url('${props.imageUrl}')` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'top center',
                        minWidth: '100px',
                        minHeight: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {props.imageUrl
                        ? <img src={props.imageUrl} style={{ display: 'block', visibility: 'hidden' }} alt="" />
                        : <Avatar variant="square" sx={{ width: '200px', height: '200px' }}></Avatar>
                    }
                </Box>
            </Box>
        </DialogEx >
    );
}
