import { Delete, Upload } from '@mui/icons-material/';
import { Box, Button, ButtonProps, Theme, useMediaQuery } from '@mui/material';
import Avatar from '../../components/Avatar';
import { useModal } from 'mui-modal-provider';
import { ChangeEvent } from 'react';
import { EVENTS, SERVER_URL } from '../../app/constants';
import { useStoreSelector } from '../../store/store';
import ProgressiveImage from '../ProgressiveImage';
import ConfirmDialog from './ConfirmDialog';
import DialogEx from './DialogEx';


interface ViewEditAvatarDialogProps {
    title?: string;
    filename: string;
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
    const store = useStoreSelector(state => state.auth);
    const acceptTypes: string[] = store?.serverCfg?.avatarFiles?.types ?? [];
    const maxBytes: number = store?.serverCfg?.avatarFiles?.maxBytes ?? 0;
    const avatarsUrl = `${SERVER_URL}/storage/avatars/`;

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
        const ext = (file.name ?? '').toLowerCase().split('.').pop();
        if (acceptTypes.indexOf(ext ?? '') < 0) {
            PubSub.publish(EVENTS.TOAST, {
                type: 'error',
                autoHide: false,
                message: 'Only images of the following type are allowed: ' +
                    acceptTypes.join(', ')
            });
            return;
        }

        if (!maxBytes || file.size > maxBytes) {
            const mb = (maxBytes / (1000 * 1000)).toFixed(2);
            PubSub.publish(EVENTS.TOAST, {
                type: 'error',
                autoHide: false,
                message: `The image exceeds the maximum allowed file size of ${mb}mb.
                Please try a smaller image.`
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
                    m: 1,

                }}>
                    {props.filename &&
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

                >
                    {props.filename
                        ? <ProgressiveImage
                            src={`${avatarsUrl}large/${props.filename}`}
                            //The medium image should already be cached as it is used in the parent dialog.
                            //If you are testing with cache disabled then this effect will be broken.
                            placeholderSrc={`${avatarsUrl}medium/${props.filename}`}
                            alt=""
                            width={500}
                            height={500}
                            showIndicator={false}
                        />
                        :
                        <Avatar
                            variant="square"
                            sx={{ width: '200px', height: '200px' }}
                            brokenImageMethod="image"
                        />
                    }
                </Box>
            </Box>
        </DialogEx >
    );
}
