import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '../../components/Link';
import { ChangeEvent, SyntheticEvent } from 'react';
import { Box } from '@mui/system';

interface FormProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: SyntheticEvent) => void;
    disabled?: boolean;
}

export const title = 'Forgot Password';

export default function ForgotPasswordStep1(props: FormProps) {
    return (
        <form onSubmit={props.onSubmit}>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={props.onChange}
                />
                <Button type="submit" fullWidth variant="contained" color="primary" disabled={props.disabled} sx={{ mb: 2 }}>
                    Send Password Reset Email
                </Button>
                <Link to="/login">
                    Return to Login
                </Link>
            </Box>
        </form >
    );
}
