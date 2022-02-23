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


const GridHeaderCheckbox = () => {
    const apiRef = useGridApiContext();
    const [checked, setChecked] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        let rowIds: GridRowId[] = [];
        if (checked) {
            rowIds = apiRef.current.getAllRowIds();
        }
        apiRef.current.setSelectionModel(rowIds);
        setChecked(checked);
    };

    return (
        <Checkbox onChange={handleChange} checked={checked} />
    );
}

const GridCellCheckbox = (params: GridRenderCellParams) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const selModel: GridSelectionModel = [];
        params.api.getSelectedRows().forEach((row) => {
            if (row.id != params.id) {
                selModel.push(row.id);
            }
        });

        if (checked) {
            selModel.push(params.id);
        }
        params.api.setSelectionModel(selModel);
    };

    const checked = params.api.isRowSelected(params.id);
    return (
        <Checkbox onChange={handleChange} checked={checked} />
    );
};

const AvatarCheckBox: GridColDef = {
    field: 'id',
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    width:70,
    renderHeader: (params: GridColumnHeaderParams) => {
        return <GridHeaderCheckbox />;
    },
    renderCell: (params: GridRenderCellParams) => {
        return <GridCellCheckbox {...params} />;
    },
};

export default AvatarCheckBox;