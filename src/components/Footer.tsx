import { Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function Footer() {

    return (
        <Box component="footer" mt="auto" pt={10} pb={1} alignSelf="center">
            <Typography variant="caption" display="block" gutterBottom>
                &copy; 2022 <Link href="https://edshortt.co.uk" target="_blank">Ed Shortt</Link>
            </Typography>
        </Box>
    );
}