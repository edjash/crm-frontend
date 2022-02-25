import { Box, Button } from '@mui/material';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import loginSchema from '../../validation/loginSchema';

interface EnterPasswordProps {
    email: string;
    onSubmit: (data: any) => void;
};

export default function EnterPassword(props: EnterPasswordProps) {
    return (
        <Form onSubmit={props.onSubmit} validationSchema={loginSchema}>
            <Box display="grid" sx={{ rowGap: 1 }}>
                <TextFieldEx
                    name="email"
                    label="Email Address"
                    required
                    autoComplete="username"
                    defaultValue={props.email}
                    hidden
                />
                <TextFieldEx
                    name="password"
                    label="Password"
                    type="password"
                    required
                    autoComplete="current-password"
                    defaultValue=''
                    autoFocus
                />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>
                    Sign In
                </Button>
            </Box>
        </Form>
    );
}

