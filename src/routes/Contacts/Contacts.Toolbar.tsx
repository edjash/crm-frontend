import Toolbar from '@material-ui/core/Toolbar';
import { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';

interface ToolbarProps {
  handleSearch: (value: string) => void;
}

export default function ContactsToolbar(props: ToolbarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value: string) => {
    if (value === '') {
      return props.handleSearch(value);
    }

    let searchFn = () => {
      props.handleSearch(value);
      setOpen(true);
    };
    debounce(searchFn, 1000, { trailing: true })();
  };

  return (
    <Toolbar>
      <div className="search">
        <div className="searchIcon">
          <SearchIcon />
        </div>
        <TextField type="search" placeholder="Search" />
      </div>
    </Toolbar>
  );
}
