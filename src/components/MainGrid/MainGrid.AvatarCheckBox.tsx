import { Checkbox } from '@mui/material';
import {
    GridColDef,
    GridColumnHeaderParams,
    GridRenderCellParams,
    GridRowId,
    GridSelectionModel,
    useGridApiContext
} from '@mui/x-data-grid';
import { ChangeEvent, useState, MouseEvent, useEffect } from 'react';
import useOnce from '../../hooks/useOnce';
import Avatar from '../Avatar';

//potentially memoise these functions
export const GridHeaderCheckbox = (props: GridColumnHeaderParams) => {
    const apiRef = useGridApiContext();
    const [checked, setChecked] = useState(false);

    useOnce(() => {
        const token = PubSub.subscribe('GRID.CHECKALL', (c, checked) => {
            toggleSelection(checked);
        });
        return () => {
            PubSub.unsubscribe(token);
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        toggleSelection(e.target.checked);
    };

    const toggleSelection = (checked: boolean) => {
        let rowIds: GridRowId[] = [];
        if (checked) {
            rowIds = apiRef.current.getAllRowIds();
        }
        apiRef.current.setSelectionModel(rowIds);
        setChecked(checked);
    }

    return (
        <Checkbox onChange={handleChange} checked={checked} />
    );
}

const GridCellCheckbox = (params: GridRenderCellParams) => {
    const selected = params.api.isRowSelected(params.id);
    const [state, setState] = useState({
        showCheckbox: selected,
        checked: selected,
    });

    useEffect(() => {
        setState({
            showCheckbox: selected,
            checked: selected,
        });
    }, [selected]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const selModel: GridSelectionModel = [];
        params.api.getSelectedRows().forEach((row) => {
            if (row.id !== params.id) {
                selModel.push(row.id);
            }
        });

        if (checked) {
            selModel.push(params.id);
        }
        params.api.setSelectionModel(selModel);
        setState({
            ...state,
            checked: checked,
            showCheckbox: checked,
        });
    };

    const onMouseOver = (e: MouseEvent<HTMLDivElement>) => {
        setState({
            ...state,
            showCheckbox: true,
        })
    }

    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        setState({
            ...state,
            showCheckbox: state.checked || false,
        })
    }

    return (
        <div
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {state.showCheckbox
                ? <Checkbox onChange={handleChange} checked={state.checked} />
                : <Avatar name={params.row.fullname} avatar={params.row.avatar} />
            }
        </div>
    );
};

const AvatarCheckBox: GridColDef = {
    field: 'id',
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    width: 60,
    renderHeader: (params: GridColumnHeaderParams) => {
        return <GridHeaderCheckbox {...params} />;
    },
    renderCell: (params: GridRenderCellParams) => {
        return <GridCellCheckbox {...params} />;
    },
};

export default AvatarCheckBox;