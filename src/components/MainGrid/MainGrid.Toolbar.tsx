import AddIcon from '@mui/icons-material/AddCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Divider, InputAdornment, Theme, Typography, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import { ChangeEvent, useRef } from 'react';

interface ToolbarProps {
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onPageChange?: (page: number) => void;
    title: string,
    titlePlural: string;
    pageCount: number;
    page: number;
    loading: boolean;
    searchChanged: boolean;
};

export default function MainGridToolbar(props: ToolbarProps) {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const timer = useRef<NodeJS.Timeout>();

    const handleSearch = (value: string) => {
        if (props.onSearch) {
            if (timer.current) {
                clearInterval(timer.current);
            }
            props.onSearch(value);
        }
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        if (!value) {
            handleSearch('');
        } else {
            timer.current = setInterval(() => handleSearch(value), 1000);
        }
    };

    return (
        <Toolbar
            disableGutters
            sx={{ display: 'flex', justifyContent: 'left' }}
        >
            {isMobile
                ?
                <Typography sx={{ pl: 2, pr: 1 }}>
                    Contacts
                </Typography>
                :
                <Box sx={{ gap: 30, flexGrow: 0 }}>
                    <Button
                        size="large"
                        startIcon={<AddIcon fontSize="inherit" htmlColor="white" />}
                        onClick={props.onCreateClick}
                        sx={{ color: 'text.primary' }}
                    >
                        Create {props.title}
                    </Button>
                </Box>
            }
            <Divider orientation="vertical" flexItem sx={{ height: 30, mr: '10px', ml: '10px', alignSelf: 'center' }} />
            <Box sx={{ flexGrow: 1, mr: 1 }}>
                <TextField
                    type="search"
                    size="small"
                    placeholder={`Search`}
                    onChange={onSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    variant="standard"
                />
            </Box>

        </Toolbar>
    );
}
