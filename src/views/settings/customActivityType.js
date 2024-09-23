// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Settings

import { Content } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import SearchInput from "../../components/search-bar/searchInput";
import { Dropdown, Modal, Table, notification } from "antd";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { useSearchParams } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import Context from "../../context/Context";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createCustomActivity,
  customActivityList,
  deleteCustomActivity,
  updateCustomActivity,
} from "../../redux/action/customActivitytype";

const CustomActivityType = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    customActivityListReducer,
    createCustomActivityReducer,
    updateCustomActivityReducer,
    deleteCustomActivityReducer,
  } = state;
  const context = useContext(Context);
  const { deleteModalOpen, setDeleteModalOpen, setLoading } = context;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchPageCount = Number(searchParams.get("search_page")) || 1;
  const [search, setSearch] = useState();

  const [customActivityTypeList, setCustomActivityTypeList] = useState("");
  const [rowData, setRowData] = useState({});

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    callingListAPI();
  }, [searchPageCount, search]);

  const callingListAPI = () => {
    //setLoading(true);
    dispatch(customActivityList(searchPageCount, search));
  };

  useEffect(() => {
    if (
      customActivityListReducer.data &&
      !customActivityListReducer.data.data.error
    ) {
      setLoading(false);
      setCustomActivityTypeList(customActivityListReducer.data.data.data);
    }
    if (
      createCustomActivityReducer.data &&
      !createCustomActivityReducer.data.data.error
    ) {
      callingListAPI();
    }
    if (
      updateCustomActivityReducer.data &&
      !updateCustomActivityReducer.data.data.error
    ) {
      callingListAPI();
    }
    if (
      deleteCustomActivityReducer.data &&
      !deleteCustomActivityReducer.data.data.error
    ) {
      callingListAPI();
    }
  }, [state]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setCreateModalOpen(true);
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
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setRowData(record);
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

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      dispatch(deleteCustomActivity(rowData.id));
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
              placeholder="Search Activity Type"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />
            <button
              className="button_primary"
              onClick={() => {
                if (customActivityTypeList.length === 30) {
                  return notification.warning({
                    message: "Cannot Create More than 30 Records of Follow Up.",
                  });
                }
                setCreateModalOpen(true);
                setRowData({});
              }}
            >
              Add Activity Type
            </button>
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
              dataSource={customActivityTypeList}
              scroll={{ y: 500 }}
            />
          </div>
          <ConfirmDelete
            title={"Custom Activity Type"}
            open={deleteModalOpen}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
              setDeleteModalOpen(data);
            }}
          />
          <AddCustomActivityType
            {...{ createModalOpen, setCreateModalOpen }}
            data={rowData}
          />
        </Content>
      </div>
    </>
  );
};

export default CustomActivityType;

const styleHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  width: "1050px",
};

export const AddCustomActivityType = ({
  createModalOpen,
  setCreateModalOpen,
  data,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { createCustomActivityReducer, updateCustomActivityReducer } = state;

  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setName(data.name || "");
  }, [data]);

  const onClose = () => {
    setCreateModalOpen(false);
    setName("");
  };

  const onSubmit = () => {
    if (!name) {
      notification.warning({ message: "Please enter the name" });
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }
    if (data.id) {
      dispatch(updateCustomActivity(data.id, name));
      return;
    }
    dispatch(createCustomActivity(name));
  };

  useEffect(() => {
    if (
      createCustomActivityReducer.data &&
      !createCustomActivityReducer.data.data.error
    ) {
      onClose();
    }
    if (
      updateCustomActivityReducer.data &&
      !updateCustomActivityReducer.data.data.error
    ) {
      onClose();
    }
  }, [state]);

  return (
    <Modal
      centered
      open={createModalOpen}
      width={600}
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {data.name ? "Update Custom Activity Type" : "Custom Activity Type"}
        </div>
      }
      onCancel={onClose}
      footer={[
        <div
          style={{
            marginTop: 20,
            display: "flex",
            background: "#fff",
            padding: 15,
            flexDirection: "row-reverse",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <button className="button_primary" onClick={onSubmit}>
            Save
          </button>
          <button
            className="button_secondary"
            style={{ marginRight: 20 }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>,
      ]}
    >
      <div style={{ padding: "10px 20px" }}>
        <label style={{ fontSize: 14 }}>
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) =>
            /^[a-zA-Z 0-9#\/(),.+-:&%]*$/.test(e.target.value) &&
            setName(e.target.value)
          }
          maxLength={150}
          placeholder="Enter  Name"
          style={{
            width: "calc(100% - 30px)",
            border: error ? "2px solid red" : "",
          }}
        />
      </div>
    </Modal>
  );
};
