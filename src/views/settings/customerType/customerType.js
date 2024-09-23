import React, { useEffect, useState, useContext } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Button, Dropdown, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../../context/Context";
import {
  DeleteIcon,
  EditIcon,
  TransferIcon,
  ViewIcon,
} from "../../../assets/globle";
import {
  customerTypeAction,
  deleteCustomerType as deleteCustomerTypeAPI,
} from "../../../redux/action/cutomerTypeAction";
import AddCustomerTypeComponent from "./addCustomerType";
import SearchInput from "../../../components/search-bar/searchInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/pagination/pagination";
import Permissions from "../../../helpers/permissions";
import TransferCustomerType from "./transferCustomer";
import "../../../components/back-confirmation/styles.css";

const CustomerTypeComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const [customerTypeList, setCustomerTypeList] = useState("");
  const [rowData, setRowdata] = useState("");
  const [search, setSearch] = useState("");
  const [handletransferAction, setHandletransferAction] = useState({
    open: false,
    showDeleteOption: false,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  let viewCustomerTypePermission = Permissions("VIEW_CUSTOMER_TYPE");
  let createCustomerTypePermission = Permissions("CREATE_CUSTOMER_TYPE");
  let editCustomerTypePermission = Permissions("EDIT_CUSTOMER_TYPE");
  let deleteCustomerTypePermission = Permissions("DELETE_CUSTOMER_TYPE");

  const context = useContext(Context);

  const { setAddCustomerTypeOpen, setLoading } = context;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { getCustomerType, deleteCustomerType } = state;

  const handleDrawerAction = (deleteOption = false) =>
    setHandletransferAction({ open: true, showDeleteOption: deleteOption });

  const items = [
    rowData.customer_count !== 0
      ? {
          key: "1",
          label: (
            <div
              onClick={() => handleDrawerAction()}
              className="action-dropdown-list"
            >
              <img
                src={TransferIcon}
                alt="view"
                style={{ filter: "invert(0.5)" }}
              />
              Transfer
            </div>
          ),
        }
      : null,
    rowData.product_count !== 0
      ? {
          key: "2",
          label: (
            <div
              onClick={() =>
                navigate(`/web/customer?customer_type=${rowData.name}&nav=true`)
              }
              className="action-dropdown-list"
            >
              <img src={ViewIcon} alt="view" /> View Details
            </div>
          ),
        }
      : null,
    editCustomerTypePermission
      ? {
          key: "3",
          label: (
            <div
              onClick={() => {
                setAddCustomerTypeOpen(true);
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : null,
    deleteCustomerTypePermission
      ? {
          key: "4",
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
        }
      : null,
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div
          onClick={() =>
            record.customer_count !== 0 &&
            navigate(`/web/customer?customer_type=${text}&nav=true`)
          }
          style={
            record.customer_count !== 0
              ? { color: "#000", cursor: "pointer", fontWeight: 600 }
              : {}
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: "No. of Customers",
      dataIndex: "customer_count",
    },
    (editCustomerTypePermission || deleteCustomerTypePermission) && {
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
  ].filter(Boolean);

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
      dispatch(deleteCustomerTypeAPI(rowData.id, 0, true));
    }
  };

  useEffect(() => {
    search
      ? dispatch(customerTypeAction(search, searchPageCount))
      : dispatch(customerTypeAction("", pageCount));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (getCustomerType.data && !getCustomerType.data.data.error) {
      setCustomerTypeList(getCustomerType.data.data.data);
      setLoading(false);
    }
    if (deleteCustomerType.data && !deleteCustomerType.data.data.error) {
      dispatch(customerTypeAction("", pageCount));
    }
  }, [state]);

  return (
    <>
      <div className="distributor_list">
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
              placeholder="Search Customer Name"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />
            {createCustomerTypePermission && (
              <button
                className="button_primary"
                onClick={() => {
                  setAddCustomerTypeOpen(true);
                  setRowdata("");
                }}
              >
                Add Customer Type
              </button>
            )}
          </div>
          <div
            style={{
              width: "1050px",
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            {viewCustomerTypePermission ? (
              <Table
                pagination={false}
                columns={columns}
                dataSource={customerTypeList !== "" ? customerTypeList : ""}
                scroll={{ y: 500 }}
              />
            ) : (
              <Table
                pagination={false}
                columns={columns}
                dataSource={""}
                scroll={{ y: 500 }}
              />
            )}
            <Pagination list={customerTypeList} search={search} />
          </div>

          <TransferModal
            isOpen={deleteModalOpen}
            isClose={setDeleteModalOpen}
            data={rowData}
            onTransfer={(event) => event && handleDrawerAction(true)}
            onDelete={(value) => value && handleDeleteCustomer(value)}
          />
          <TransferCustomerType
            action={handletransferAction}
            handleAction={setHandletransferAction}
            data={rowData}
          />
          <AddCustomerTypeComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default CustomerTypeComponent;

const TransferModal = ({ isOpen, isClose, data, onTransfer, onDelete }) => {
  const onCancel = () => {
    isClose(false);
  };

  const handleTransfer = () => {
    onTransfer(true);
    onCancel();
  };

  const handleDelete = () => {
    onDelete(true);
    onCancel();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      centered
      title={
        <div style={{ padding: "10px 20px", fontFamily: "Poppins" }}>
          {data?.customer_count === 0 ? (
            <>
              {" "}
              <div style={{ fontSize: 20, padding: "10px 0" }}>
                Delete Customers Type ?
              </div>
              <div style={{ color: "#727176", fontSize: 13 }}>
                Are You Sure, You want to Delete Your Custome Type ?
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                }}
              >
                <Button
                  className="button_secondary"
                  style={{ padding: "0px 20px" }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="button_primary"
                  style={{ borderRadius: 5 }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 20, padding: "10px 0" }}>
                Transfer Customers
              </div>
              <div style={{ color: "#727176", fontSize: 13 }}>
                Transfer all the <span>{data?.customer_count} Customer</span> of
                this Customer Type before deleting it.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                }}
              >
                <Button
                  className="button_secondary"
                  style={{ padding: "0px 20px" }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="button_primary"
                  style={{ borderRadius: 5 }}
                  onClick={handleTransfer}
                >
                  Transfer {data?.customer_count} Customers
                </Button>
              </div>
            </>
          )}
        </div>
      }
      footer={[]}
    ></Modal>
  );
};
