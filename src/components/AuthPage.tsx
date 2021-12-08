import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IAuthPage {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function AuthPage(cfg: IAuthPage) {
  return (
    <Box className="authPage">
      <Box className="head">
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {cfg.title}
        </Typography>
      </Box>
      {cfg.children}
      <Backdrop className="backdrop" open={cfg.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
