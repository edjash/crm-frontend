import { Checkbox } from '@mui/material';
import {
    GridColDef,
    GridColumnHeaderParams,
    GridRenderCellParams,
    GridRowId,
    GridSelectionModel,
    useGridApiContext
} from '@mui/x-data-grid';
import { ChangeEvent, useState } from 'react';
import useOnce from '../../hooks/useOnce';
import Avatar from '../Avatar';
import clsx from 'clsx';

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
    const [checked, setChecked] = useState(selected);

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
        setChecked(checked);
    };

    const avatar = (params.row.avatar) ? `storage/avatars/small/${params.row.avatar}` : null;

    return (
        <div className={clsx({ 'AvatarCheckBox': true, 'checked': checked || selected })}>
            <Checkbox onChange={handleChange} checked={checked || selected} />
            <Avatar name={params.row?.fullname ?? params.row.name} avatar={avatar} />
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