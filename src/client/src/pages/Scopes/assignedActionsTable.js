import { connect } from 'react-redux';
import Button from '../../components/Button';
import Table from '../../components/Table/Table';
import * as actionActions from '../../store/actions/actions';
import LinkButton from '../../components/LinkButton';

const sortByItems = [
  { label: 'Newest', sort: 'createdAt', srdir: -1 },
  { label: 'Latest Updated', sort: 'updatedAt', srdir: -1 },
  { label: 'Service Asc', sort: 'service', srdir: 1 },
  { label: 'Service Desc', sort: 'service', srdir: -1 },
  { label: 'Name Asc', sort: 'name', srdir: 1 },
  { label: 'Name Desc', sort: 'name', srdir: -1 },
];

const Actions = ({ loading, getActions, deleteAction, actions, userData }) => {
  const tool = <></>;
  const onConfirmDelete = (actionId) => {};

  const columns = [
    {
      Header: 'Actions',
      accessor: 'id',
      default: '-',
      className: 'og-table-action ',
      Cell: ({ value, row: { values: rowVal } }) => {
        return (
          <div className="flex flex-row w-full gap-x-2 place-content-center">
            <Button
              size="sm"
              color="red"
              clicked={() => onConfirmDelete(value)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      className: '',
    },
    {
      Header: 'Service',
      accessor: 'service',
      className: 'text-center',
    },
  ];

  const actionitems = (actions || {}).rows || [];

  return (
    <Table
      columns={columns}
      loading={loading}
      fetchData={getActions}
      data={actionitems}
      count={actions.count}
      pageCount={actions.pageCount}
      exportCsv={false}
      tools={tool}
      sortByItems={sortByItems}
      defaultColumnWidth="10rem"
    />
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.actions.loading.actions,
    userData: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getList: (dtRequest) => dispatch(actionActions.getList(dtRequest)),
    deleteAction: (id) => dispatch(actionActions.deleteAction(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
