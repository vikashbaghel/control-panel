import React, { useEffect, useState, useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Styles from "./settings.module.css";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { useNavigate } from "react-router";
import {
  adminList as adminListAPI,
  deleteAdmin,
} from "../../redux/action/adminSetting";
import moment from "moment";
import AddAdminComponent from "./addAdmin";
import Avatar from "../../assets/globle/user_icon.png";
import { DeleteIcon, DeleteOutlineIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { useSearchParams } from "react-router-dom";

const AdminComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const dispatch = useDispatch();
  const { adminList } = useSelector((state) => state);
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setCreateAdminIsOpen, setDeleteModalOpen, setLoading } = context;
  const [rowData, setRowdata] = useState("");
  const [adminListData, setAdminListData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    search
      ? dispatch(adminListAPI(search, searchPageCount))
      : dispatch(adminListAPI("", pageCount));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (adminList.data !== "") {
      if (adminList.data.data.error === false) {
        setAdminListData(adminList.data.data.data);
        setLoading(false);
      }
    }
  }, [adminList]);

  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      width: "300px",
      render: (text, record) => (
        <div
          style={{
            color: "#000000",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <img src={Avatar} alt="img" className={Styles.profile_icon} />
          </div>
          <div>{record.full_name}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <div>{moment(text).format("DD-MMM-YYYY")}</div>,
      align: "center",
    },
    {
      title: " ",
      dataIndex: " ",
      key: "action",
      render: (text, record) => (
        <img
          src={DeleteOutlineIcon}
          alt="delete"
          onClick={() => {
            setDeleteModalOpen(true);
            setRowdata(record);
          }}
          className="clickable"
        />
      ),
      align: "end",
      width: 50,
    },
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "1050px",
  };

  const handleDeleteCustomer = (data) => {
    if (data) {
      dispatch(deleteAdmin(rowData.id));
      setTimeout(() => {
        dispatch(adminListAPI(search, pageCount));
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
            <div className="search_input">
              <input
                placeholder="Search Admin Name"
                onChange={(e) =>
                  setTimeout(() => {
                    setSearch(e.target.value);
                  }, 500)
                }
              />
              <SearchOutlined />
            </div>
            {/* <div> */}
            <button
              className="button_primary"
              onClick={() => {
                setCreateAdminIsOpen(true);
              }}
            >
              Add Admin
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
              dataSource={adminListData !== "" ? adminListData : ""}
              scroll={{ y: 500 }}
            />
          </div>
          <ConfirmDelete
            title={"Admin"}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
            }}
          />
          <AddAdminComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default AdminComponent;
