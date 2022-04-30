import { Typography, useTheme } from "@mui/material";
import { useEffect, useState, useRef } from "react";

interface BoxProgressProps {
    percent: number;
    size: number;
    borderRadius: string;
    delaySeconds?: number;
}

export default function BoxProgress(props: BoxProgressProps) {
    const theme = useTheme();
    const timerRef = useRef<NodeJS.Timeout>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.delaySeconds) {
            timerRef.current = setTimeout(() => {
                setLoading(false);
            }, props.delaySeconds * 1000);
        } else {
            setLoading(false);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    }, [props.delaySeconds]);


    return (
        <div
            className="boxProgress"
            style={{
                width: props.size,
                height: props.size,
                borderRadius: props.borderRadius,
                position: 'relative',
                display: (loading) ? 'none' : 'flex',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    height: props.percent + '%',
                    alignSelf: 'flex-end',
                    width: '100%',
                    opacity: 0.5,
                    background: `${theme.palette.primary.main}`
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    color="text.secondary"
                >
                    {`${props.percent}%`}
                </Typography>
            </div>
        </div>
    );
}