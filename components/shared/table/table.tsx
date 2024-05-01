import { TableContainer, Table, Paper, Skeleton, TableBody, TableCell, TableRow } from '@mui/material';

export const TableLoading = ({ itemsPerPage, columsPerPage }: { itemsPerPage: number, columsPerPage: number }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="loading table">
        <TableBody>
          {[...Array(itemsPerPage)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(columsPerPage)].map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const TableDataNotFound = () => {
  return (
    <div>Data Not Found</div>
  )
}
