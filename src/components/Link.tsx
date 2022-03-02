import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledLink = styled(RouterLink)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
}));

export default function Link(props: LinkProps) {
    return (
        <StyledLink {...props}>
            {props.children}
        </StyledLink >
    );
}