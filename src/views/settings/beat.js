import React, { useEffect, useState, useContext } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Styles from "./settings.module.css";
import { Dropdown, Spin, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import Permissions from "../../helpers/permissions";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { beatDeleteService, beatService } from "../../redux/action/beatAction";
import moment from "moment";
import AddBeatComponent from "./addBeat";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchInput from "../../components/search-bar/searchInput";
import Pagination from "../../components/pagination/pagination";

const BeatComponent = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const [apiData, setApiData] = useState([]);
  const [rowData, setRowdata] = useState("");
  const [search, setSearch] = useState("");

  const context = useContext(Context);
  const { setAddBeatOpen, deleteModalOpen, setDeleteModalOpen, setLoading } =
    context;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    search
      ? dispatch(beatService(searchPageCount, search))
      : dispatch(beatService(pageCount, ""));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (state.getBeat.data !== "") {
      if (state.getBeat.data.data.error === false)
        setApiData(state.getBeat.data.data.data);
      setLoading(false);
    }
  }, [state]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setAddBeatOpen(true);
            navigate(`/web/setting?tab=Beat&id=${rowData.id}`);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text) => {
        return <div>{moment(text).format("DD-MMM-YYYY, hh:mm a")}</div>;
      },
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setRowdata(record);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
            className="action-dropdown"
          >
            <div className="clickable">
              <MoreOutlined className="action-icon" />
            </div>
          </Dropdown>
        </div>
      ),
    },
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "1050px",
  };

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      dispatch(beatDeleteService(rowData, false));
      setTimeout(() => {
        dispatch(beatService("", pageCount));
      }, 400);
    }
  };

  return (
    <>
      <div className="table_list position-rel">
        <Content
          style={{
            padding: "0px 24px",
            margin: 0,
            height: "82vh",
            background: "transparent",
          }}
        >
          <div style={styleHeader}>
            <SearchInput
              placeholder="Search Beat"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />

            {/* <div> */}
            <button
              className="button_primary"
              onClick={() => {
                setAddBeatOpen(true);
                setRowdata("");
                navigate(`/web/setting?tab=Beat&id=0`);
              }}
            >
              Create Beat
            </button>
            {/* </div> */}
          </div>

          <div
            style={{
              width: "1050px",
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            <Table
              pagination={false}
              columns={columns}
              dataSource={apiData !== "" ? apiData : ""}
              scroll={{ y: 500 }}
            />
            <Pagination list={apiData} search={search} />
          </div>
          <ConfirmDelete
            title={"Lead Category"}
            open={deleteModalOpen}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
              setDeleteModalOpen(data);
            }}
          />
          <AddBeatComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default BeatComponent;
