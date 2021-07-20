import Layout from '../../hoc/layout';
import { useState } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Table from '../../components/Table/Table';
import * as actionActions from '../../store/actions/actions';
import { formatString } from '../../utils/dateUtil';
import LinkButton from '../../components/LinkButton';
import Modal from '../../components/Modal/Modal';

const sortByItems = [
  { label: 'Newest', sort: 'createdAt', srdir: -1 },
  { label: 'Latest Updated', sort: 'updatedAt', srdir: -1 },
  { label: 'Service Asc', sort: 'service', srdir: 1 },
  { label: 'Service Desc', sort: 'service', srdir: -1 },
  { label: 'Name Asc', sort: 'name', srdir: 1 },
  { label: 'Name Desc', sort: 'name', srdir: -1 },
];

const Actions = ({ loading, getList, deleteAction, actions, userData }) => {
  const tool = (
    <>
      <LinkButton
        size="sm"
        className="btn-sm flex-grow-0 leading-6"
        to={'/actions/new'}
      >
        <i className="fa fa-plus mr-2 my-auto "></i>Add New
      </LinkButton>
    </>
  );
  const doDeleteActions = (id) => {
    deleteAction(id).then((res) => {
      onConfirmClosed();
      // this.props.showSnackBar("Delete Success", { success: true })
    });
  };
  const onConfirmDelete = (actionId) => {
    setConfirmState({
      show: true,
      current: actions.rows.find((t) => t.id === actionId),
    });
  };

  const columns = [
    {
      Header: 'Actions',
      accessor: 'id',
      default: '-',
      className: 'og-table-action ',
      Cell: ({ value, row: { values: rowVal } }) => {
        return (
          <div className="flex flex-row w-full gap-x-2 place-content-center">
            <LinkButton size="sm" to={'/actions/' + value}>
              Edit
            </LinkButton>
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
      headerStyle: {
        width: '10rem',
      },
    },
    {
      Header: 'Service',
      accessor: 'service',
      className: 'text-center',
      headerStyle: {
        width: '10rem',
      },
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      className: 'text-center',
      Cell: ({ value }) => {
        return <div>{formatString(value, 'dd MMM yyyy HH:mm')}</div>;
      },
    },
    {
      Header: 'Updated At',
      accessor: 'updatedAt',
      className: 'text-center',
      Cell: ({ value }) => {
        return <div>{formatString(value, 'dd MMM yyyy HH:mm')}</div>;
      },
    },
  ];

  const actionitems = (actions || {}).rows || [];

  const [confirmState, setConfirmState] = useState({
    show: false,
    current: null,
  });

  const onConfirmClosed = () => {
    setConfirmState({
      show: false,
      current: null,
    });
  };

  return (
    <Layout title="Actions">
      <Table
        columns={columns}
        loading={loading}
        fetchData={getList}
        data={actionitems}
        count={actions.count}
        pageCount={actions.pageCount}
        exportCsv={false}
        tools={tool}
        sortByItems={sortByItems}
        defaultColumnWidth="10rem"
      />
      <Modal show={confirmState.show} closed={onConfirmClosed}>
        <p className="text-center">Are you sure deleting :</p>
        <ol>
          <li>
            Action : <strong>{confirmState?.current?.name}</strong>
          </li>
          <li>Service : {confirmState?.current?.service}</li>
        </ol>
        <div className="flex flex-row items-start gap-x-2 mt-4">
          <Button
            size="md"
            className="ml-auto"
            clicked={() => doDeleteActions(confirmState?.current?.id)}
          >
            Delete
          </Button>
          <Button
            size="md"
            className="mr-auto"
            color="gray"
            clicked={onConfirmClosed}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    actions: state.actions.actions,
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
