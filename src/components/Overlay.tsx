import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import { CircularProgress, SxProps, Theme } from "@mui/material";
import { ReactNode } from 'react';

interface OverlayProps {
    open: boolean;
    content?: string | JSX.Element;
    useAbsolute?: boolean;
    showProgress?: boolean;
    zIndex?: number;
    backdropProps?: BackdropProps;
    sx?: SxProps<Theme>;
    children?: ReactNode;
}

export default function Overlay(props: OverlayProps) {

    const zIndex = props.zIndex ?? 1000;
    let sx = {
        ...props?.sx,
        zIndex: zIndex,
    };

    if (props.useAbsolute) {
        sx = {
            ...sx,
            position: 'absolute',
            // backgroundColor: 'rgb(100 100 100 / 50%)',
        };
    }

    return (
        <Backdrop {...props.backdropProps} sx={sx} open={props.open}>
            {props.showProgress &&
                <CircularProgress color="primary" />
            }
            {props?.content && (
                props.content
            )}
            {props.children}
        </Backdrop>
    );
}
