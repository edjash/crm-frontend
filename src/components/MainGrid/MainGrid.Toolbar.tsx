import AddIcon from '@mui/icons-material/AddCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Divider, IconButton, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import debounce from 'lodash/debounce';
import { ChangeEvent, useMemo, useState } from 'react';

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
    const [inputValue, setInputValue] = useState('');
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    const handleSearch = (value: string) => {
        if (props.onSearch) {
            handleSearchDelayed.cancel();
            props.onSearch(value);
        }
    };

    const handleSearchDelayed = useMemo(
        () => debounce(handleSearch, 1000, { trailing: true }),
        []
    );

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!value) {
            handleSearch('');
        } else {
            handleSearchDelayed(value);
        }
    };

    return (
        <Toolbar
            disableGutters
            sx={{ display: 'flex', justifyContent: 'left' }}
        >
            <Box sx={{ gap: 30 }}>
                {isDesktop ?
                    <Button
                        size="large"
                        startIcon={<AddIcon fontSize="inherit" htmlColor="white" />}
                        onClick={props.onCreateClick}
                        sx={{color:'text.primary'}}
                    >
                        Create {props.title}
                    </Button>
                    :
                    <IconButton onClick={props.onCreateClick} size="large">
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                }
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 30, mr: '10px', ml: '10px', alignSelf: 'center' }} />
            <Box sx={{ flexGrow: 0.2 }}>
                <TextField
                    type="search"
                    size="small"
                    placeholder={`Search ${props.titlePlural}`}
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
