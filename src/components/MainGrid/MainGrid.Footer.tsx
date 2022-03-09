import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton, TablePagination } from '@mui/material';

interface FooterProps {
    onPageChange: (page: number) => void;
    pageCount: number;
    rowCount: number;
    page: number;
    rowsPerPage: number;
    loading: boolean;
    searchChanged: boolean;
    onRefreshClick?: () => void;
    showPagination: boolean;
}

export default function MainGridFooter(props: FooterProps) {

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        props.onPageChange(page + 1);
    };

    let PaginationElement = <></>;
    if (props.showPagination &&
        (!props.loading || !props.searchChanged)) {
        PaginationElement = (
            <>
                <TablePagination
                    showFirstButton
                    showLastButton
                    component='div'
                    count={props.rowCount}
                    page={props.page - 1}
                    onPageChange={handlePageChange}
                    rowsPerPage={props.rowsPerPage}
                    rowsPerPageOptions={[]}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={props.onRefreshClick}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            {PaginationElement}
        </Box >
    );
}


