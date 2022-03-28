import { Box } from "@mui/material";
import { SERVER_URL } from '../app/constants';

interface SocialIconProps {
    network: string;
}

export default function SocialIcon(props: SocialIconProps) {
    const url = SERVER_URL + '/storage/socialmedia/24x24/';

    return (
        <Box sx={{ height: 24, width: 24 }}>
            <img src={`${url}${props.network.toLowerCase()}.png`} alt={props.network} />
        </Box>
    );
}
