import React from 'react';
import { useTable, usePagination } from 'react-table';
import Box from '../Card';
import TextBox from '../TextBox';
import Select from '../Select/Select';
import * as styles from './Table.module.css';
import SearchBar from '../SearchBox';
import ALinkButton from '../LinkButton';
import { findOne } from '../../utils/utilities';

const SortBy = ({ children, onClick, currentSort = false }) => {
  return (
    <span
      onClick={onClick}
      className={[
        currentSort ? 'bg-gray-300' : 'hover:bg-gray-100 cursor-pointer',
        'block px-4 py-2 text-xs text-gray-700',
      ].join(' ')}
    >
      {children}
    </span>
  );
};

const defaultSortByItems = [{ label: 'Latest', sort: 'createdAt', srtdir: -1 }];

const Table = ({
  columns,
  data,
  fetchData,
  loading,
  count: totalItem,
  pageCount: totalPage,
  defaultPageSize,
  containerClass,
  neudirection,
  exportCsv,
  tools,
  sortByItems = defaultSortByItems,
  defaultColumnWidth = '5rem',
}) => {
  // const {
  //     columns,
  //     data,
  //     fetchData,
  //     loading,
  //     count: totalItem,
  //     pageCount: totalPage,
  //     defaultPageSize
  // } = props
  exportCsv = typeof exportCsv === 'undefined' ? true : exportCsv;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: totalPage,
    },
    usePagination,
  );

  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState({ sortdir: '', sort: '', label: '' });
  const [exportUrl, setExportUrl] = React.useState('');

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({
      page: pageIndex + 1,
      size: pageSize,
      q: search,
      srdir: sort.srdir,
      sort: sort.sort,
    }).then((res) => setExportUrl(res.url));
  }, [fetchData, pageIndex, pageSize, search, sort]);

  React.useEffect(() => {
    fetchData({
      page: 1,
      size: 10,
      q: search,
      srdir: sort.srdir,
      sort: sort.sort,
    }).then((res) => setExportUrl(res.url));
  }, []);

  const [showSort, setShowSort] = React.useState(false);

  const onToggleSort = (evt) => {
    evt.stopPropagation();
    setShowSort((prevstate) => !prevstate);
  };

  const onSelectSort = ({ sort, srdir, label }) => {
    setSort({
      sort,
      srdir,
      label,
    });
    setShowSort(false);
  };

  const sortClass = [
    showSort ? 'border-blue-700' : '',
    sort.label ? 'text-blue-700' : '',
  ].join(' ');

  return (
    <Box
      className={[styles.container, containerClass].join(' ')}
      neudirection={neudirection || 'neu-'}
    >
      <div className="flex flex-row gap-x-4">
        <SearchBar
          groupclass="flex-grow"
          changed={({ value }) => {
            setSearch(value);
          }}
          searchDelay={450}
          //value={search}
          placeholder="Search..."
        ></SearchBar>
        <div>
          <button
            type="button"
            onClick={onToggleSort}
            className={
              sortClass +
              ' ml-auto md:ml-0 max-w-xs text-gray-600 hover:text-blue-500 border border-gray-300 hover:border-blue-500 rounded-md flex justify-center py-2 px-4 items-center focus:outline-none'
            }
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            sort
          </button>
          {showSort ? (
            <div
              className="origin-top-right z-20 absolute right-16 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              {sortByItems.map((sortItem) => {
                return (
                  <SortBy
                    key={sortItem.label}
                    currentSort={sort.label === sortItem.label}
                    onClick={() => onSelectSort(sortItem)}
                  >
                    {sortItem.label}
                  </SortBy>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row gap-x-4 w-auto mt-8">
        {tools ? tools : null}
        {exportCsv ? (
          <ALinkButton
            rootelement="a"
            size="sm"
            to={exportUrl + '&out=csv'}
            download
          >
            Export CSV
          </ALinkButton>
        ) : null}
      </div>
      <div
        className={[styles.tablecontainer, 'slimscroll', 'overflow-auto'].join(
          ' ',
        )}
      >
        <table {...getTableProps()} className={styles.table}>
          <thead className={styles.head}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  let headerStyle = {
                    ...(column.headerStyle || {}),
                  };

                  headerStyle.width = headerStyle.width || defaultColumnWidth;

                  return (
                    <th
                      {...column.getHeaderProps()}
                      className={[column.headerClass].join(' ')}
                      style={headerStyle}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className={styles.body}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={styles.row}>
                  {row.cells.map((cell) => {
                    const col = findOne(
                      columns,
                      (col) =>
                        col.id === cell.column.id ||
                        col.accessor === cell.column.id,
                    );

                    return (
                      <td
                        {...cell.getCellProps()}
                        className={[styles.cell, (col || {}).className].join(
                          ' ',
                        )}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}

      <div
        className={[
          styles.trloading,
          'flex sm:flex-col sm:text-left md:flex-row',
        ].join(' ')}
      >
        {loading ? (
          // Use our custom loading state to show a loading indicator
          <div>Loading...</div>
        ) : (
          <>
            <div>
              Showing {page.length} from {totalItem} rows
            </div>
            <div className="md:flex-grow md:text-right">
              Page {pageIndex + 1} of {Math.ceil(totalItem / page.length)}{' '}
            </div>
          </>
        )}
      </div>
      <div
        className={[
          styles.pagetools,
          'flex-col-reverse gap-y-4 md:flex-row',
        ].join(' ')}
      >
        <div>
          <Select
            groupclass={[styles.pagesize].join(' ')}
            options={[10, 20, 30, 40, 50]}
            getValue={(t) => t}
            getText={(t) => t}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e));
              gotoPage(0);
            }}
          ></Select>
        </div>
        {/* {canPreviousPage ?
                    
                    : null
                } */}
        <div className={[styles.pagination, 'hidden md:flex'].join(' ')}>
          <Box
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={[
              styles.pagingitem,
              styles.left,
              'clickable',
              canPreviousPage ? '' : 'disabled',
            ].join(' ')}
          >
            <i className="fa fa-angle-double-left text-indigo-800 leading-10"></i>
          </Box>

          <Box
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={[
              styles.pagingitem,
              'clickable',
              canPreviousPage ? '' : 'disabled',
            ].join(' ')}
          >
            <i className="fa fa-angle-left text-indigo-800 leading-10"></i>
          </Box>

          {canPreviousPage ? (
            <Box
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={[
                styles.pagingitem,
                'clickableplain text-indigo-800  cursor-pointer font-semibold leading-10',
                canPreviousPage ? '' : 'disabled',
              ].join(' ')}
            >
              {pageIndex}
            </Box>
          ) : null}

          <div className={[styles.pagingitem, styles.activepage].join(' ')}>
            {pageIndex + 1}
          </div>

          {canNextPage ? (
            <Box
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={[
                styles.pagingitem,
                'clickableplain text-indigo-800  font-semibold cursor-pointer leading-10',
              ].join(' ')}
            >
              {pageIndex + 2}
            </Box>
          ) : null}

          <Box
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={[
              styles.pagingitem,
              'clickable',
              canNextPage ? '' : 'disabled',
            ].join(' ')}
          >
            <i className="fa fa-angle-right text-indigo-800 leading-10"></i>
          </Box>

          <Box
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={[
              styles.pagingitem,
              styles.right,
              'clickable',
              canNextPage ? '' : 'disabled',
            ].join(' ')}
          >
            <i className="fa fa-angle-double-right text-indigo-800 leading-10"></i>
          </Box>
        </div>
        <div className={[styles.gotopage, 'flex-row'].join(' ')}>
          <TextBox
            groupclass={styles.goto}
            type="number"
            defaultValue={pageIndex + 1}
            placeholder="Go to Page"
            changed={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </div>{' '}
      </div>
    </Box>
  );
};

export default Table;
