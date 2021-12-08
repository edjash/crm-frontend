import { ChangeEvent, SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

export const title = 'New Password';

interface FormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export default function ForgotPasswordStep3(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextField
        variant="outlined"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={props.onChange}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete=""
        onChange={props.onChange}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Submit Password
      </Button>
      <Link href="/login" variant="body2">
        Return to Login
      </Link>
    </form>
  );
}
