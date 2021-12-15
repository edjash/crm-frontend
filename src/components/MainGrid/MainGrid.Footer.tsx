import { Box, TablePagination } from '@mui/material';
import { useGridApiContext, useGridState } from '@mui/x-data-grid';

interface FooterProps {
    onPageChange: (page: number) => void;
    pageCount: number;
    rowCount: number;
    page: number;
    loading: boolean;
    searchChanged: boolean;
}

export default function MainGridFooter(props: FooterProps) {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        props.onPageChange(page + 1);
    };

    let PaginationElement = <></>;
    if (!props.loading || !props.searchChanged) {
        PaginationElement = (
            <TablePagination
                showFirstButton
                showLastButton
                component='div'
                count={props.rowCount}
                page={props.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={10}
                rowsPerPageOptions={[]}
            />
        );
    }


    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'right'
        }}>
            {PaginationElement}
        </Box>
    );
}


