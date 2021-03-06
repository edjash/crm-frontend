import { Box, SxProps, Typography } from "@mui/material";
import { ImgHTMLAttributes, useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholderSrc: string;
    width: number;
    height: number;
    showIndicator?: boolean;
    containerSx?: SxProps;
    style?: Record<string, any>;
}

export default function ProgressiveImage(props: ProgressiveImageProps) {

    const {
        placeholderSrc,
        containerSx,
        showIndicator,
        style,
        width,
        height,
        ...imgProps
    } = props;


    const [state, setState] = useState({
        loading: true,
        currentSrc: placeholderSrc,
    });

    useEffect(() => {
        const src: string = props.src;
        const imageToLoad = new Image();
        imageToLoad.src = src;
        imageToLoad.onload = () => {
            setState({ currentSrc: src, loading: false });
        }
    }, [props.src]);

    return (
        <Box sx={{
            width: `${width}px`,
            height: `${height}px`,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...props.containerSx,
        }}>
            <div style={{
                display: (props?.showIndicator === true && state.loading) ? 'block' : 'none',
                position: 'absolute',
                fontSize: (width / 12 < 11) ? width / 12 : 10,
            }}>
                <Typography sx={{ fontSize: '2em' }}>Loading...</Typography>
                <LinearProgress />
            </div>
            <img
                className="ProgressiveImage"
                style={{
                    opacity: state.loading ? 0.5 : 1,
                    transition: "opacity .15s linear",
                    width: '100%',
                    height: '100%',
                    ...props.style,
                }}
                alt=''
                {...imgProps}
                src={state.currentSrc}
            />
        </Box >
    );
}
