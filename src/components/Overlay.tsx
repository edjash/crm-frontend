import { CircularProgress } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';

type OverlayProps = {
    open: boolean;
    message?: string;
};


export default function Overlay(props: OverlayProps) {

    return (
        <Backdrop open={props.open}>
            <CircularProgress color="primary" />
            {props?.message && (
                <div className="message">
                    {props.message}
                </div>
            )}
        </Backdrop>
    );
}
