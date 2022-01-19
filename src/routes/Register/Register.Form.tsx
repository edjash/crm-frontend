import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '../../components/Link';
import { ChangeEvent, SyntheticEvent } from 'react';
import { Box } from '@mui/system';

interface RegisterFormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <h2>Registration is disabled for this demo</h2>
      <Box sx={{ display: 'grid', rowGap: 1 }}>
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
        <Button type="submit" fullWidth variant="contained" color="primary" disabled={true}>
          Sign Up
        </Button>
        <Link to="/login">
          Already have an account? Sign in
        </Link>
      </Box>
    </form>
  );
}
