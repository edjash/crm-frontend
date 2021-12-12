import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '../../components/Link';
import Grid from '@mui/material/Grid';
import { ChangeEvent, SyntheticEvent } from 'react';
import { Box } from '@mui/system';

interface LoginFormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}



export default function LoginForm(props: LoginFormProps) {
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
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link to="/register">
              Don't have an account? Sign Up!
            </Link>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
