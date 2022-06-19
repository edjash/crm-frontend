import { SxProps, Tooltip } from '@mui/material';
import MuiAvatar from '@mui/material/Avatar';
import { MouseEventHandler } from 'react';
import { SERVER_URL } from '../app/constants';

export interface AvatarProps {
    name?: string;
    avatar?: string | null;
    sx?: SxProps;
    brokenImageMethod?: 'image' | 'text',
    onMouseOver?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    variant?: 'circular' | 'rounded' | 'square';
    className?: string;
    tooltipProps?: {
        title: string;
        placement?: "bottom" | "left" | "right" | "top"
        | "bottom-end" | "bottom-start" | "left-end"
        | "left-start" | "right-end" | "right-start"
        | "top-end" | "top-start"
    }
};

export default function Avatar(props: AvatarProps) {
    const name = props.name ?? '';
    const nameA = (name) ? name.split(' ') : ['?'];
    let str: string | null = '';
    nameA.forEach((s, index) => {
        if (index < 2) {
            str += s[0];
        }
    });

    let src = '';
    let bgColor = 'custom.appBarBackground';

    if (props.avatar) {
        src = `${SERVER_URL}/${props.avatar}`;
        bgColor = 'transparent';
    } else {
        const method = props.brokenImageMethod ?? 'text';
        if (method !== 'text') {
            str = null;
        }
    }

    const avatar = (
        <MuiAvatar
            alt={props.name}
            src={src}
            sx={{
                color: 'custom.appBarText',
                backgroundColor: bgColor,
                fontSize: '95%',
                ...props.sx,
            }}
            onMouseOver={props.onMouseOver}
            onMouseLeave={props.onMouseLeave}
            variant={props.variant}
            className={props.className}
        >
            {str}
        </MuiAvatar>
    );

    if (props.tooltipProps) {
        return (
            <Tooltip {...props.tooltipProps}>
                {avatar}
            </Tooltip>
        );
    }

    return avatar;
}