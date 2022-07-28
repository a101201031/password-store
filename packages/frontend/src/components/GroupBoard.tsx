import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
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
import {
  AuthAsyncBoundary,
  CardIndicator,
  CircularIndicator,
} from 'components';
import type { AccountGroupModel } from 'model';
import { Fragment, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import type { AccountListByGroupTypes, GroupTableRowTypes } from 'store';
import {
  accountListByGroupSltr,
  groupSubTableOpenAtom,
  groupTableRowSltr,
} from 'store';

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
      {
        header: 'Modify',
        accessorKey: 'gid',
        cell: () => (
          <IconButton aria-label="delete" size="large">
            <EditIcon fontSize="inherit" />
          </IconButton>
        ),
      },
    ],
    [],
  );

  const groupList = useRecoilValue(groupTableRowSltr);
  const [open, setOpen] = useRecoilState(groupSubTableOpenAtom);

  const table = useReactTable({
    columns,
    data: groupList,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            <TableCell />
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow>
              <TableCell>
                {row.getValue<number>('accounts') ? (
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => {
                      setOpen({
                        ...open,
                        [row.getValue<string>('gid')]:
                          !open[row.getValue<string>('gid')],
                      });
                    }}
                  >
                    {open[row.getValue<string>('gid')] ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                ) : (
                  false
                )}
              </TableCell>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {open[row.getValue<string>('gid')] && (
                <AuthAsyncBoundary
                  suspenseFallback={
                    <TableCell colSpan={6}>
                      <Grid container justifyContent="center">
                        <CircularIndicator />
                      </Grid>
                    </TableCell>
                  }
                >
                  <SubMemberTable gid={row.getValue<string>('gid')} />
                </AuthAsyncBoundary>
              )}
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

interface SubMemberTableProps extends Pick<AccountGroupModel, 'gid'> {}

function SubMemberTable({ gid }: SubMemberTableProps) {
  const accountListByGroup = useRecoilValue(accountListByGroupSltr({ gid }));
  const open = useRecoilValue(groupSubTableOpenAtom);
  const columns = useMemo<ColumnDef<AccountListByGroupTypes>[]>(
    () => [
      {
        header: 'Service name',
        accessorKey: 'service_name',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Account',
        accessorKey: 'service_account',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'OAuth',
        accessorKey: 'authentication',
        cell: (v) => v.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: accountListByGroup,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={open[gid]} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Typography variant="h6" gutterBottom component="div">
            Members
          </Typography>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </TableCell>
  );
}

export { GroupBoard };
