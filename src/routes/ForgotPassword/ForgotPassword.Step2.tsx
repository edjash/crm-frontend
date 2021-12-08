import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { ChangeEvent, SyntheticEvent } from 'react';

interface FormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export const title = 'Enter Code';

export default function ForgotPasswordStep2(props: FormProps) {
  
  return (
    <form className="enterCode" onSubmit={props.onSubmit}>
      <Paper elevation={6}>
        <p>
          If your email address exists in our system, you'll receive an email
          with a code to reset your password.
        </p>
        <p>Please enter the code you receive below:</p>
        <TextField
          variant="filled"
          required
          id="code"
          label="Enter Code"
          name="code"
          autoFocus
          onChange={props.onChange}
        />
      </Paper>
      <Button type="submit" fullWidth variant="contained" color="primary">
        Submit
      </Button>
      <Link href="/login" variant="body2">
        Return to Login
      </Link>
    </form>
  );
}
