import Toolbar from '@material-ui/core/Toolbar';
import { useState, useMemo, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import Typography from '@material-ui/core/Typography';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';

interface ToolbarProps {
    onSearch?: (value: string) => void;
    onCreateClick?: () => void;
    onRefreshClick?: () => void;
    title: string
}

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

    return (
        <Toolbar className="gridToolbar">
            <Typography className="label">
                {props.title}
            </Typography>
            <div className="search">
                <div className="searchIcon">
                    <SearchIcon />
                </div>
                <TextField type="search" placeholder="Search" onChange={onSearch} />
            </div>
            <div>
                <IconButton onClick={props.onRefreshClick}>
                    <RefreshIcon />
                </IconButton>
                <IconButton onClick={props.onCreateClick}>
                    <AddIcon />
                </IconButton>
            </div>
        </Toolbar>
    );
}
