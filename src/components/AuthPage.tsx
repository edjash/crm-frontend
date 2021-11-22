import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
