import {
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AuthAsyncBoundary, CardIndicator } from 'components';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import type { GroupTableRowTypes } from 'store';
import { groupTableRowSltr } from 'store';

function GroupBoard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'grid',
            }}
          >
            <Grid
              container
              sx={{ mb: 2, minHeight: '36px' }}
              wrap="nowrap"
              justifyContent="space-between"
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                Groups
              </Typography>
            </Grid>
            <Divider />
            <AuthAsyncBoundary
              errorFallback={(_) => {
                return null;
              }}
              suspenseFallback={
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <CardIndicator />
                  <CardIndicator />
                </Grid>
              }
            >
              <GroupTable />
            </AuthAsyncBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function GroupTable() {
  const columns = useMemo<ColumnDef<GroupTableRowTypes>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'group_name',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Member count',
        accessorKey: 'accounts',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Created at',
        accessorKey: 'created_at',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const groupList = useRecoilValue(groupTableRowSltr);
  const table = useReactTable({
    columns,
    data: groupList,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          // <TableRow {...headerGroup.getHeaderGroupProps()}>
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              // <TableCell {...column.getHeaderProps()}>
              <TableCell key={header.id}>
                {header.column.columnDef.header}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { GroupBoard };
