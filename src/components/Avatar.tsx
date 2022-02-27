import MuiAvatar from '@mui/material/Avatar';
import { SERVER_URL } from '../app/constants';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

interface AvatarProps {
    name: string;
    avatar: string;
};

export default function Avatar(props: AvatarProps) {
    const nameA = props.name.split(' ');
    let str = '';
    nameA.map((s, index) => {
        if (index < 2) {
            str += s[0];
        }
    });

    let src = '';
    if (props.avatar) {
        src = `${SERVER_URL}/storage/avatars/${props.avatar}`;
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