import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Card, Drawer, Table, Radio, Tag } from "antd";
import viewTotalOrderImg from "../../assets/images/Group2042.svg";
import viewTotalPaymentImg from "../../assets/images/Path2596.svg";
import moment from "moment";
import {
  staffOrderService,
  staffPaymentService,
} from "../../redux/action/staffAction";
import { toIndianCurrency } from "../../helpers/convertCurrency";

const StaffView = ({
  id,
  name,
  employee_id,
  department,
  total_payment_received,
  total_sales,
}) => {
  const context = useContext(Context);
  const {
    staffViewOpen,
    setStaffViewOpen,
    setNewStaffData,
    newStaffData,
    setNewStaffViewOrder,
  } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [tableType, setTableType] = useState("");
  const [staffOrder, setStaffOrder] = useState("");
  const [staffPayment, setStaffPayment] = useState("");
  const onClose = () => {
    setStaffViewOpen(false);
    setNewStaffData("");
    setNewStaffViewOrder("");
  };

  useEffect(() => {
    // let id = rowData.id
    dispatch(staffOrderService(id));
    dispatch(staffPaymentService(id));
  }, [id]);

  useEffect(() => {
    if (state.staffOrder.data !== "") {
      if (state.staffOrder.data.data.error === false) {
        state.staffOrder.data.data.data.map((ele) => {
          ele.orderBy = ele.created_by.first_name;
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          // ele.total_amount = '₹ ' + ele.total_amount
        });
        setStaffOrder(state.staffOrder.data.data.data);
      }
    }
    if (state.staffPayment.data !== "") {
      if (state.staffPayment.data.data.error === false) {
        state.staffPayment.data.data.data.map((ele) => {
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          ele.order_by =
            ele.created_by.first_name + " " + ele.created_by.last_name;
        });
        setStaffPayment(state.staffPayment.data.data.data);
      }
    }
  }, [state]);

  const columnsOrder = [
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Customer",
      dataIndex: "fullName",
    },
    {
      title: "Order By",
      dataIndex: "orderBy",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      render: (text) => (
        <div style={{ color: "black" }}>
          {toIndianCurrency(text.toLocaleString("en"))}
        </div>
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

  const columnsPayment = [
    {
      title: "Customer",
      dataIndex: "fullName",
    },

    {
      title: "Date",
      dataIndex: "created_at",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => (
        <div style={{ color: "black" }}>
          {toIndianCurrency(text.toLocaleString("en"))}
        </div>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_mode",
    },
  ];

  return (
    <>
      {/* {""} */}
      {newStaffData && (
        <>
          <Drawer
            className="container"
            title={
              <>
                <CloseOutlined onClick={onClose} /> <span>Staff View</span>{" "}
              </>
            }
            width={820}
            closable={false}
            onClose={onClose}
            open={staffViewOpen}
            style={{ overflowY: "auto" }}
          >
            <Card>
              <div>
                <div style={{ display: "flex" }}>
                  <p style={marginStyleForP}>Name : </p>{" "}
                  <p style={marginStyleForP}> {name}</p>
                </div>
                <div style={{ display: "flex" }}>
                  <p style={marginStyleForP}>Department : </p>{" "}
                  <p style={marginStyleForP}> {department}</p>
                </div>
                <div style={{ display: "flex" }}>
                  <p style={marginStyleForP}>ID : </p>{" "}
                  <p style={marginStyleForP}> {employee_id}</p>
                </div>
              </div>
            </Card>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Radio.Group
                name="radiogroup"
                defaultValue="order"
                onChange={(e) => setTableType(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="order" style={{ width: 120 }}>
                  Sales / Order
                </Radio.Button>
                <Radio.Button value="payment" style={{ width: 120 }}>
                  Payment
                </Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <div>
                {tableType === "payment" ? (
                  <>
                    <Card>
                      <div>
                        <div style={{ display: "flex" }}>
                          <img src={viewTotalPaymentImg} alt="viewIcon" />
                          <div style={{ marginLeft: "30px" }}>
                            <p>Payment Received </p>{" "}
                            <p style={marginStyleForP}>
                              {" "}
                              {toIndianCurrency(total_payment_received)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <div>
                      <p>Recent Payment</p>
                      <Table
                        bordered
                        pagination={false}
                        columns={columnsPayment}
                        dataSource={staffPayment && staffPayment}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Card>
                      <div>
                        <div style={{ display: "flex" }}>
                          <img src={viewTotalOrderImg} alt="viewIcon" />
                          <div style={{ marginLeft: "30px" }}>
                            <p>Total Sales </p>
                            <p style={marginStyleForP}>
                              {toIndianCurrency(total_sales)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <div>
                      <p>Recent Order</p>
                      <Table
                        bordered
                        columns={columnsOrder}
                        pagination={false}
                        dataSource={staffOrder && staffOrder}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </Drawer>
        </>
      )}
    </>
  );
};
export default StaffView;

const marginStyleForP = {
  margin: "5px",
  fontWeight: "bold",
};
