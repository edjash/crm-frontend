
import { GridOverlay } from '@mui/x-data-grid/';
import LinearProgress from '@mui/material/LinearProgress';

export default function LoadingOverlay(msg:string) {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', background:'#111920', zIndex:1000, opacity:'0.5' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}