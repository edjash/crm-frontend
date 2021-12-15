import AddIcon from '@mui/icons-material/AddCircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import debounce from 'lodash/debounce';
import { ChangeEvent, useMemo, useState } from 'react';

interface ToolbarProps {
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onRefreshClick?: () => void;
    onPageChange?: (page: number) => void;
    title: string,
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
            style={{ paddingLeft: 0, paddingRight: 0 }}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>

            <IconButton onClick={props.onCreateClick} size="large">
                <AddIcon fontSize="inherit" />
            </IconButton>
            <Box sx={{ display: 'inline' }}>
                <TextField
                    type="search"
                    placeholder={`Search ${props.title}`}
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

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={props.onRefreshClick}>
                    <RefreshIcon />
                </IconButton>
            </Box>
        </Toolbar>
    );
}
