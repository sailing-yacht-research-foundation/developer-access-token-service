import Layout from '../../hoc/layout';
import { useState } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Table from '../../components/Table/Table';
import * as developerActions from '../../store/actions/developers';
import { formatString } from '../../utils/dateUtil';
import LinkButton from '../../components/LinkButton';
import Modal from '../../components/Modal/Modal';
import * as utilActions from '../../store/actions/utils';

const sortByItems = [
  { label: 'Newest', sort: 'createdAt', srdir: -1 },
  { label: 'Latest Updated', sort: 'updatedAt', srdir: -1 },
  { label: 'Name Asc', sort: 'name', srdir: 1 },
  { label: 'Name Desc', sort: 'name', srdir: -1 },
];

const Developers = ({
  loading,
  getList,
  deleteDeveloper,
  developers,
  showSnackbar,
}) => {
  const tool = (
    <>
      <LinkButton
        size="sm"
        className="btn-sm flex-grow-0 leading-6"
        to={'/developers/new'}
      >
        <i className="fa fa-plus mr-2 my-auto "></i>Add New
      </LinkButton>
    </>
  );
  const doDeleteDevelopers = (data) => {
    deleteDeveloper(data.id).then((res) => {
      onConfirmClosed();
      showSnackbar(`${data.name} Deleted`, { success: true });
    });
  };
  const onConfirmDelete = (developerId) => {
    setConfirmState({
      show: true,
      current: developers.rows.find((t) => t.id === developerId),
    });
  };

  const columns = [
    {
      Header: 'Developers',
      accessor: 'id',
      default: '-',
      className: 'og-table-developer ',
      Cell: ({ value, row: { values: rowVal } }) => {
        return (
          <div className="flex flex-row w-full gap-x-2 place-content-center">
            <LinkButton size="sm" to={'/developers/' + value}>
              Edit
            </LinkButton>
            <LinkButton size="sm" to={'/developers/' + value + '/tokens'}>
              Tokens
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
      className: 'text-center',
      headerStyle: {
        width: '10rem',
      },
    },
    {
      Header: 'Email',
      accessor: 'email',
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

  const developeritems = (developers || {}).rows || [];

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
    <Layout title="Developers">
      <Table
        columns={columns}
        loading={loading}
        fetchData={getList}
        data={developeritems}
        count={developers.count}
        pageCount={developers.pageCount}
        exportCsv={false}
        tools={tool}
        sortByItems={sortByItems}
        defaultColumnWidth="10rem"
      />
      <Modal show={confirmState.show} closed={onConfirmClosed}>
        <p className="text-center">Are you sure deleting :</p>
        <ol>
          <li>
            Developer : <strong>{confirmState?.current?.name}</strong>
          </li>
          <li>Email : {confirmState?.current?.email}</li>
        </ol>
        <div className="flex flex-row items-start gap-x-2 mt-4">
          <Button
            size="md"
            className="ml-auto"
            clicked={() => doDeleteDevelopers(confirmState?.current)}
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
    developers: state.developers.developers,
    loading: state.developers.loading.developers,
    userData: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getList: (dtRequest) => dispatch(developerActions.getList(dtRequest)),
    deleteDeveloper: (id) => dispatch(developerActions.deleteDeveloper(id)),
    showSnackbar: (message, opt) =>
      dispatch(utilActions.showSnackbar(message, opt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Developers);
