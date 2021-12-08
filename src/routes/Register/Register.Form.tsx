import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { ChangeEvent, SyntheticEvent } from 'react';

interface RegisterFormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        onChange={props.onChange}
      />
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
        Sign Up
      </Button>
      <Link href="/login" variant="body2">
        Already have an account? Sign in
      </Link>
    </form>
  );
}
