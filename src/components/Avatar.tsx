import MuiAvatar from '@mui/material/Avatar';
import { SERVER_URL } from '../app/constants';

interface AvatarProps {
    name: string;
    avatar: string;
};

export default function Avatar(props: AvatarProps) {
    const nameA = props.name.split(' ');
    let str = '';
    nameA.forEach((s, index) => {
        if (index < 2) {
            str += s[0];
        }
    });

    let src = '';
    if (props.avatar) {
        src = `${SERVER_URL}/${props.avatar}`;
    }

    return (
        <MuiAvatar
            alt={props.name}
            src={src}
            sx={{ color: '#666666', background: '#2c2c2c', fontSize: '95%', }}
        >
            {str}
        </MuiAvatar>
    );
}