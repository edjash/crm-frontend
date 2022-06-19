import { Checkbox } from '@mui/material';
import {
    GridColDef,
    GridColumnHeaderParams,
    GridRenderCellParams,
    GridRowId,
    GridRowModel,
    GridSelectionModel,
    useGridApiContext
} from '@mui/x-data-grid';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { EVENTS } from '../../app/constants';
import useOnce from '../../hooks/useOnce';
import Avatar, { AvatarProps } from '../Avatar';

//potentially memoise these functions
export const GridHeaderCheckbox = (props: GridColumnHeaderParams) => {
    const apiRef = useGridApiContext();
    const [checked, setChecked] = useState(false);

    useOnce(() => {
        const token = PubSub.subscribe(EVENTS.GRID_CHECKALL, (c, checked) => {
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

interface GridCellCheckboxProps {
    renderCellParams: GridRenderCellParams;
    avatarProps?: AvatarProps;
}

const GridCellCheckbox = (props: GridCellCheckboxProps) => {
    const params = props.renderCellParams;
    const selected = params.api.isRowSelected(params.id);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const selModel: GridSelectionModel = [];
        params.api.getSelectedRows().forEach((row: GridRowModel) => {
            if (row.id !== params.id) {
                selModel.push(row.id);
            }
        });

        if (checked) {
            selModel.push(params.id);
        }
        params.api.setSelectionModel(selModel);
    };

    const avatar = (params.row.avatar) ? `storage/avatars/small/${params.row.avatar}` : null;

    return (
        <div className={clsx({ 'AvatarCheckBox': true, 'checked': selected })}>
            <Checkbox onChange={handleChange} checked={selected} />
            <Avatar name={params.row?.fullname ?? params.row.name} avatar={avatar} {...props.avatarProps} />
        </div>
    );
};

interface AvatarCheckBoxProps {
    avatarProps?: AvatarProps;
}

const AvatarCheckBox = (props: AvatarCheckBoxProps): GridColDef => {
    return {
        field: 'id',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        width: 60,
        renderHeader: (params: GridColumnHeaderParams) => {
            return <GridHeaderCheckbox {...params} />;
        },
        renderCell: (params: GridRenderCellParams) => {
            return <GridCellCheckbox renderCellParams={params} avatarProps={props.avatarProps} />;
        },
    };
};

export default AvatarCheckBox;