import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";

import { Card, Drawer, Table, Tag } from "antd";
import { customerDetailsByIdAction } from "../../redux/action/distributorDetailsAction";
import { orderActionDetailsBYId } from "../../redux/action/getOrderDetalsByIdAction";
import { paymentActionByIDAction } from "../../redux/action/getPaymentByIdAction";
import total_sales_img from "../../../src/assets/total_sales.png";
import payment_img from "../../../src/assets/payment.png";

//api called

// import AddNewCustomerCategory from './addCustomerCategoryDrower'

const ViewOrderAndPaymentDetails = () => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const {
    setOpenViewDistributorDetails,
    editDistributorData,
    openDistributorOrder_Payment,
    setOpenDistributorOrder,
    tableType,
  } = context;
  const state = useSelector((state) => state);
  const [distributorDetails, setDisributorDetails] = useState("");
  // const [tableType, setTableType] = useState('')
  const [orderdetais, setOrderDetails] = useState("");
  const [paymentlist, setPaymentList] = useState("");
  const [lastDate, setLastDate] = useState("");

  // // open category list
  // useEffect(() => {
  //   dispatch(customerDetailsByIdAction(1));
  // }, []);

  useEffect(() => {
    if (state.disributor_details.data !== "") {
      if (state.disributor_details.data.data.error === false) {
        setDisributorDetails(state.disributor_details.data.data.data);
      }
    }

    //order list
    let dataFlag = true;
    if (state.order_detail_byid.data !== "") {
      if (state.order_detail_byid.data.data.error === false)
        state.order_detail_byid.data.data.data.map((ele) => {
          ele.orderBy =
            ele.created_by.first_name + " " + ele.created_by.last_name;
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");

          if (dataFlag) {
            dataFlag = false;
            setLastDate(ele.created_at);
          }
          // ele.updated_at = moment(ele.updated_at).format("DD-MMM-YYYY");

          // ele.total_amount = '₹ ' + ele.total_amount
        });
      setOrderDetails(state.order_detail_byid.data.data.data);
    }
    //payment details
    if (state.payment_detail_byid.data !== "") {
      if (state.payment_detail_byid.data.data.error === false)
        state.payment_detail_byid.data.data.data.map((ele) => {
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          ele.order_by =
            ele.created_by.first_name + " " + ele.created_by.last_name;
        });
      setPaymentList(state.payment_detail_byid.data.data.data);
    }
  }, [state]);

  const onClose = () => {
    setOpenViewDistributorDetails(true);
    setOpenDistributorOrder(false);
    // setEditDistributorData('')
  };

  /* eslint-enable no-template-curly-in-string */

  // //get distributor details

  useEffect(() => {
    if (editDistributorData.id) {
      dispatch(orderActionDetailsBYId(editDistributorData.id));
      dispatch(paymentActionByIDAction(editDistributorData.id));
    }
  }, [editDistributorData.id]);

  //order column name
  const columnsOrder = [
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Name",
      dataIndex: "fullName",
    },
    {
      title: "Order By",
      dataIndex: "orderBy",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (text) => (
        <div style={{ color: "black" }}>{toIndianCurrency(text)}</div>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
    },
    {
      title: "Status",
      key: "tags",
      dataIndex: "delivery_status",
      render: (_, { delivery_status }) => {
        let color =
          delivery_status === "Received" || delivery_status === "Pending"
            ? "yellow"
            : delivery_status === "Delivered"
            ? "green"
            : delivery_status === "Rejected"
            ? "red"
            : delivery_status === "Approved"
            ? "purple"
            : delivery_status === "Processing"
            ? "blue"
            : delivery_status === "Shipped"
            ? "green"
            : "gray";
        return (
          <Tag color={color} key={delivery_status}>
            {delivery_status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];
  //payment column name
  const columns2 = [
    {
      title: "Name",
      dataIndex: "fullName",
    },
    {
      title: "Mode",
      dataIndex: "payment_mode",
    },

    {
      title: "Date",
      dataIndex: "created_at",
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      render: (text) => (
        <div style={{ color: "black" }}>{toIndianCurrency(text)}</div>
      ),
    },
  ];

  return (
    <>
      {editDistributorData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>View Details</span>{" "}
            </>
          }
          width={650}
          closable={false}
          onClose={onClose}
          open={openDistributorOrder_Payment}
          style={{ overflowY: "auto" }}
        >
          {tableType == "payment" ? (
            <div>
              <Card style={{ marginBottom: "7px" }}>
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <img src={payment_img} alt="image" width={30}></img>
                    <p
                      style={{
                        margin: "5px",
                        fontWeight: "bold",
                        // width: '100px',
                      }}
                    >
                      Payment Received :{" "}
                    </p>{" "}
                    <p style={marginStyleForP}>
                      {" "}
                      {toIndianCurrency(
                        editDistributorData.total_payment_amount_received
                      )}
                    </p>
                  </div>
                </div>
              </Card>
              {/* <h3>Payment Received</h3> */}

              <Table
                pagination={false}
                columns={columns2}
                dataSource={paymentlist && paymentlist}
              />
            </div>
          ) : (
            <div>
              <Card style={{ marginBottom: "7px" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      // marginRight: '10rem',
                    }}
                  >
                    <img src={total_sales_img} alt="image" width={30}></img>
                    <p
                      style={{
                        margin: "5px",
                        fontWeight: "bold",
                        // width: '100px',
                      }}
                    >
                      Total Sales :{" "}
                    </p>{" "}
                    <p style={marginStyleForP}>
                      {" "}
                      {toIndianCurrency(editDistributorData.total_amount_sales)}
                    </p>
                  </div>
                </div>
              </Card>
              {/* <h3>Recent Order</h3> */}
              <Table
                pagination={false}
                columns={columnsOrder}
                dataSource={orderdetais && orderdetais}
              />
            </div>
          )}
        </Drawer>
      )}
    </>
  );
};
export default ViewOrderAndPaymentDetails;
const marginStyleForP = {
  margin: "5px",
  fontWeight: "bold",
};
const stylefonts = {
  fontWeight: "bold",
};
