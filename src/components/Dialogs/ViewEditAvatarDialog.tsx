import { Delete, Upload } from '@mui/icons-material/';
import { Box, Button, Theme, useMediaQuery } from '@mui/material';
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
                size='small'
                variant='outlined'
                startIcon={<Upload />}
                component="span"
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
            contentProps={{
                dividers: true,
                sx: {
                    p: 5
                }
            }}
            justifyActionButtons='space-between'
            saveButtonComponent={
                <FileUploadButton
                    onChange={onFileInputChange}
                    acceptTypes={acceptTypes}
                />
            }
            cancelButtonText='Delete'
            cancelButtonProps={{
                variant: 'outlined',
                size: 'small',
                startIcon: <Delete />,
                onClick: onDelete
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url('${props.imageUrl}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center center',
                    width: '100%',
                    height: '100%',
                }}
            />
        </DialogEx >
    );
}
