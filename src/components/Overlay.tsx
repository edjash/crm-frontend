import { CircularProgress, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';

type OverlayProps = {
    open: boolean;
    message?: string;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        indicator: {
            position: 'absolute',
            top: '0px',
            width: '100%'
        }
    }),
);

export default function Overlay(props: OverlayProps) {
    const classes = useStyles();

    return (
        <Backdrop open={props.open} className={classes.backdrop}>
            <CircularProgress color="primary" />
            {props?.message && (
                <div className="message">
                    {props.message}
                </div>
            )}
        </Backdrop>
    );
}
