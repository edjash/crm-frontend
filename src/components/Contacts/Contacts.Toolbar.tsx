import Toolbar from '@material-ui/core/Toolbar';
import { useState, useMemo, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';

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

  return (
    <Toolbar>
      <div className="search">
        <div className="searchIcon">
          <SearchIcon />
        </div>
        <TextField type="search" placeholder="Search" onChange={onSearch} />
      </div>
    </Toolbar>
  );
}
