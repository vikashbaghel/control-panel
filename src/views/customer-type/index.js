import { CloseCircleTwoTone, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Popconfirm, Space, Spin, Table, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { customerCategoryAction } from "../../redux/action/customerCategoryAction";
import Context from "../../context/Context";
import AddNewCustomerCategory from "../../components/viewDrawer/addCustomerCategoryDrower";
import { accessType } from "../../config";
import EditCustomerCategory from "../../components/viewDrawer/editCustomerCategoryDrower";
import Permissions from "../../helpers/permissions";
import {
  customerTypeAction,
  deleteCustomerType,
} from "../../redux/action/cutomerTypeAction";
import AddNewCustomerType from "../../components/viewDrawer/addCustomerTypeDrower";
import EditCustomerType from "../../components/viewDrawer/editCustomerTypeDrower";

const CustomerType = () => {
  const navigate = useNavigate();
  const [customerTypeList, setCustomerTypeList] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteCustomerTypeId, setDeleteCustomerTypeId] = useState("");
  const context = useContext(Context);
  const {
    setAddCustomerTypeOpen,
    setEditCustomerTypeOpen,
    setEditCustomerTypeData,
  } = context;


  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  useEffect(() => {
    dispatch(customerTypeAction());
  }, []);

  useEffect(() => {
    if (state.getCustomerType.data !== "") {
      if (state.getCustomerType.data.data.error === false) {
        setCustomerTypeList(state.getCustomerType.data.data.data);
      }
    }
  }, [state]);

  const handleDeleteProduct = () => {
    dispatch(deleteCustomerType(deleteCustomerTypeId));
    setTimeout(() => {
      dispatch(customerTypeAction());
    }, 200);
  };

  const style = {
    icon: {
      color: "#34C38F",
      cursor: "pointer",
      fontSize: 18,
    },
  };

  const columns = [
    {
      title: "Type Name",
      dataIndex: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text, record) => (
        <Space
          size="middle"
          direction="horizontal"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            setEditCustomerTypeData({ name: record.name, id: record.id });
            setDeleteCustomerTypeId(record.id);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
          >
            <a style={{ color: "black" }}>...</a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div onClick={() => setEditCustomerTypeOpen(true)}>
          <EditOutlined style={style.icon} /> Edit
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          <Popconfirm
            title="Are You Sure, You want to Delete ?"
            onConfirm={() => handleDeleteProduct()}
          >
            <CloseCircleTwoTone twoToneColor="red" /> Delete
          </Popconfirm>
        </div>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //pagination handle page count plus
  const handleAdd = () => {
    setPageCount(pageCount + 1);
  };

  //pagination handle page count plus
  const handleRemove = () => {
    if (pageCount === 1) {
      return;
    }
    setPageCount(pageCount - 1);
  };

  //get paginatin data from get api
  useEffect(() => {
    dispatch(customerCategoryAction(pageCount));
    setLoading(false);
  }, [pageCount]);
  return (
    <div>
      <h2 className="page_title">
        Customer Type List
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/customer-type")}>
            {" "}
            / customer-type
          </span>
        </div>
      </h2>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          background: colorBgContainer,
          position: "relative",
        }}
      >
        <tr>
          <td>
            {customerTypeList ? (
              <div>
                <h2 style={{ contain: "", marginBottom: 40 }}></h2>
                <Button
                  style={{ position: "absolute", top: 15, right: 24 }}
                  type="primary"
                  className="btn-rounded  mb-2 me-2 btn btn-success"
                  onClick={() => {
                    // dispatch(orderViewAction(record.id))
                    setAddCustomerTypeOpen(true);
                  }}
                >
                  <i className="mdi mdi-plus me-1" />
                  Add Customer Type
                </Button>
                {/* </Link> */}
              </div>
            ) : (
              <></>
            )}
          </td>
          <td
            style={{ display: "flex", flexDirection: "columns-reverse" }}
          ></td>
        </tr>

        <Table
          pagination={false}
          columns={columns}
          dataSource={customerTypeList !== "" ? customerTypeList : ""}
        />

        <AddNewCustomerType />
        <EditCustomerType />
        <br />
        <tr style={{ display: "flex", flexDirection: "row-reverse" }}>
          <div style={{ display: "flex" }}>
            <Button
              disabled={pageCount === 1 ? true : false}
              type="primary"
              onClick={() => {
                handleRemove();
                setLoading(true);
              }}
            >
              {"<"}
            </Button>
            <Button style={{ marginLeft: "5px", marginRight: "5px" }}>
              {pageCount}
            </Button>
            <Button
              type="primary"
              disabled={customerTypeList.length < 30 ? true : false}
              onClick={() => {
                handleAdd();
                setLoading(true);
              }}
            >
              {">"}
            </Button>
          </div>
        </tr>
      </Content>
    </div>
  );
};

export default CustomerType;
