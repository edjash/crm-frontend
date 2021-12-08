import Toolbar from '@mui/material/Toolbar';
import { useState, useMemo, ChangeEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import debounce from 'lodash/debounce';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { InputAdornment } from '@material-ui/core';

interface ToolbarProps {
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onRefreshClick?: () => void;
    title: string,
    onPageChange?: (event: object, page: number) => void;
    pageCount: number;
    page: number;
    loading: boolean;
    searchChanged: boolean;
};

export default function MainGridToolbar(props: ToolbarProps) {
    const [inputValue, setInputValue] = useState('');

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

    let PaginationElement = <></>;
    if ((!props.loading || !props.searchChanged) && props.pageCount > 1) {
        PaginationElement = (
            <Pagination
                count={props.pageCount}
                page={props.page}
                onChange={props.onPageChange}
                variant="outlined"
                shape="rounded"
            />
        );
    }

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
                {PaginationElement}
                <IconButton onClick={props.onRefreshClick}>
                    <RefreshIcon />
                </IconButton>
            </Box>
        </Toolbar>
    );
}
