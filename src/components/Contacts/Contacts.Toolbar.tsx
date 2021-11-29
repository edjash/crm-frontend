import Toolbar from '@material-ui/core/Toolbar';
import { useState, useMemo, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import Typography from '@material-ui/core/Typography';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface ToolbarProps {
  onSearch?: (value: string) => void;
}

export default function ContactsToolbar(props: ToolbarProps) {
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

  const handleAddClick = () => {
    PubSub.publish('SHOW_EDIT_CONTACT');
  }

  return (
    <Toolbar className="gridToolbar">
      <Typography className="label">
        Contacts
      </Typography>
      <div className="search">
        <div className="searchIcon">
          <SearchIcon />
        </div>
        <TextField type="search" placeholder="Search" onChange={onSearch} />
      </div>
      <IconButton onClick={handleAddClick}>
        <AddIcon />
      </IconButton>
    </Toolbar>
  );
}
