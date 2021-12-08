import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { ChangeEvent, SyntheticEvent } from 'react';

interface FormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export const title = 'Forgot Password';

export default function ForgotPasswordStep1(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit}>
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
      <Button type="submit" fullWidth variant="contained" color="primary">
        Send Password Reset Email
      </Button>
      <Link href="/login" variant="body2">
        Return to Login
      </Link>
    </form>
  );
}
