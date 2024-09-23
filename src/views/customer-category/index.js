import { EditOutlined } from "@ant-design/icons";
import { Button, Spin, Table, theme } from "antd";
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

const CustomerCategory = () => {
  const navigate = useNavigate();
  const [customerCategoryList, setCustomerCategoryList] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const {
    setOrderViewOpen,
    setEditCustomerCategoryOpen,
    setEditCustomerCategoryData,
  } = context;

  let viewCustomerCategory = Permissions("VIEW_CUSTOMER_CATEGORY");
  let createCustomerCategory = Permissions("CREATE_CUSTOMER_CATEGORY");
  let editCustomerCategory = Permissions("EDIT_CUSTOMER_CATEGORY");
  let deleteCustomerCategory = Permissions("DELETE_CUSTOMER_CATEGORY");

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  useEffect(() => {
    dispatch(customerCategoryAction());
  }, []);

  useEffect(() => {
    if (state.customerCategory.data !== "") {
      if (state.customerCategory.data.data.error === false) {
        setCustomerCategoryList(state.customerCategory.data.data.data);
      }
    }
  }, [state]);

  const columnsAdmin = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text) => <div style={{ color: "blue" }}>{text}</div>,
    },
    {
      title: "Discount Value in (%)",
      dataIndex: "discount_value",
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
        <div>
          <EditOutlined
            style={style.icon}
            onClick={() => {
              // alert(record.id)
              setEditCustomerCategoryOpen(true);
              setEditCustomerCategoryData(record);
            }}
          />
        </div>
      ),
    },
  ];

  const columnsStaff = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text) => <a style={{ color: "blue" }}>{text}</a>,
    },
    {
      title: "Discount Value in (%)",
      dataIndex: "discount_value",
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
    },
  ];

  const style = {
    icon: {
      color: "#34C38F",
      cursor: "pointer",
      fontSize: 18,
    },
  };

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
        Customer Category List
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/customer-category")}>
            {" "}
            / Customer-category
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
            {createCustomerCategory ? (
              <div>
                <h2 style={{ contain: "", marginBottom: 40 }}></h2>
                <Button
                  style={{ position: "absolute", top: 15, right: 24 }}
                  type="primary"
                  className="btn-rounded  mb-2 me-2 btn btn-success"
                  onClick={() => {
                    // dispatch(orderViewAction(record.id))
                    setOrderViewOpen(true);
                  }}
                >
                  <i className="mdi mdi-plus me-1" />
                  Add New Category
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
        {viewCustomerCategory ||
        createCustomerCategory ||
        editCustomerCategory ||
        deleteCustomerCategory ? (
          loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          ) : (
            <Table
              pagination={false}
              columns={
                accessType === "WEB_SARE360" ? columnsAdmin : columnsStaff
              }
              dataSource={
                customerCategoryList !== "" ? customerCategoryList : ""
              }
            />
          )
        ) : (
          <></>
        )}
        <AddNewCustomerCategory />
        <EditCustomerCategory />
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
              disabled={customerCategoryList.length < 30 ? true : false}
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

export default CustomerCategory;
