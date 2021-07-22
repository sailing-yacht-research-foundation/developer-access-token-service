import Layout from '../../hoc/layout';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Table from '../../components/Table/Table';
import * as developerTokenActions from '../../store/actions/developerTokens';
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

const DeveloperTokens = ({
  loading,
  getList,
  deleteDeveloperToken,
  developerTokens,
  getDevById,
  developersDetail,
  showSnackbar,
}) => {
  const params = useParams();
  const devId = params.developerId;
  const tool = (
    <>
      <LinkButton
        size="sm"
        className="btn-sm flex-grow-0 leading-6"
        to={'/developers/' + devId + '/tokens/new'}
      >
        <i className="fa fa-plus mr-2 my-auto "></i>Add New
      </LinkButton>
    </>
  );
  const doDeleteDeveloperTokens = (data) => {
    deleteDeveloperToken(data.id).then((res) => {
      onConfirmClosed();
      showSnackbar(`${data.name} Deleted`, { success: true });
    });
  };
  const onConfirmDelete = (developerTokenId) => {
    setConfirmState({
      show: true,
      current: developerTokens.rows.find((t) => t.id === developerTokenId),
    });
  };

  const columns = [
    {
      Header: 'Developer Tokens',
      accessor: 'id',
      default: '-',
      className: 'og-table-developerToken ',
      Cell: ({ value, row: { values: rowVal } }) => {
        return (
          <div className="flex flex-row w-full gap-x-2 place-content-center">
            <LinkButton
              size="sm"
              to={'/developers/' + devId + '/tokens/' + value}
            >
              View
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

  const developerTokenitems = (developerTokens || {}).rows || [];

  useEffect(() => {
    getDevById(devId);
  }, [devId]);

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
  const getPage = (paging) => {
    return getList(devId, paging);
  };
  return (
    <Layout title={`${developersDetail.name}'s Tokens`}>
      <Table
        columns={columns}
        loading={loading}
        fetchData={getPage}
        data={developerTokenitems}
        count={developerTokens.count}
        pageCount={developerTokens.pageCount}
        exportCsv={false}
        tools={tool}
        sortByItems={sortByItems}
        defaultColumnWidth="10rem"
      />
      <Modal show={confirmState.show} closed={onConfirmClosed}>
        <p className="text-center">Are you sure deleting :</p>
        <ol>
          <li>
            DeveloperToken : <strong>{confirmState?.current?.name}</strong>
          </li>
        </ol>
        <div className="flex flex-row items-start gap-x-2 mt-4">
          <Button
            size="md"
            className="ml-auto"
            clicked={() => doDeleteDeveloperTokens(confirmState?.current)}
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
    developerTokens: state.developerTokens.developerTokens,
    developersDetail: state.developers.detail,
    loading: state.developerTokens.loading.developerTokens,
    userData: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDevById: (id) => dispatch(developerActions.getById({ id })),
    getList: (id, dtRequest) =>
      dispatch(developerTokenActions.getList(id, dtRequest)),
    deleteDeveloperToken: (id) =>
      dispatch(developerTokenActions.deleteDeveloperToken(id)),
    showSnackbar: (message, opt) =>
      dispatch(utilActions.showSnackbar(message, opt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperTokens);
