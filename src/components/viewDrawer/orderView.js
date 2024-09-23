import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Input, Table } from "antd";
import moment from "moment";
import { useNavigate } from "react-router";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { updateStatus } from "../../redux/action/orderAction";
import DispatchHistory from "../card/dispatchHistory";
import { orderViewAction } from "../../redux/action/orderViewAction";
import Permissions from "../../helpers/permissions";
import Cookies from "universal-cookie";
import styles from "../viewDrawer/order.module.css";
import eyeIcon from "../../assets/eye.svg";
import ModalForImagePreview from "../modalForImagePreview/ModalForPreview";
import { cartConstants } from "../../services/cart-service";
import { handleEditOder } from "../../helpers/globalFunction";

const { TextArea } = Input;

const OrderView = () => {
  const context = useContext(Context);
  const {
    orderViewOpen,
    setOrderViewOpen,
    setCartNumber,
    setShippedOrderData,
    setPreviewOpen,
    setPreviewImage,
  } = context;
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderView, setOrderView] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [status, setStatus] = useState("Please Select");
  const cookies = new Cookies();

  let orderStatusUpdatePermission = Permissions("ORDER_STATUS_UPDATE");
  let editOrderPermission = Permissions("EDIT_ORDER");
  let dispatchOrderPermission = Permissions("DISPATCH_ORDER");

  const onClose = () => {
    setOrderViewOpen(false);
    setStatus("Please Select");
  };

  const onPreview = (file) => {
    let src = file;
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (state.orderView.data !== "") {
      if (state.orderView.data.data.error === false) {
        setOrderView(state.orderView.data.data.data);
      }
    }
  }, [state]);

  const handleStatusChange = (e) => {
    setStatus(e);

    if (e === "Rejected") {
      setShowRejectReason(true);
      return;
    }
    if (e === "Shipped") {
      localStorage.setItem(
        "rupyzDispatchItems",
        JSON.stringify(state.orderView.data.data.data.items)
      );
      onClose();
      navigate("/web/order/shipped-order");
      return;
    }
    if (e === "Close") {
      dispatch(updateStatus(orderView.id, { is_close: true }));
      setShowRejectReason(false);
    }
    dispatch(updateStatus(orderView.id, { delivery_status: e }));
    setShowRejectReason(false);
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(orderViewAction(orderView.id));
    }, 1000);
  }, [status]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div
          style={{
            width: 200,
            color: "rgb(8, 134, 210)",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Code",
      dataIndex: "qty",
      render: (text, record) => (
        <div style={{ color: "gray" }}>{record.code}</div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      render: (text) => <>{text}</>,
    },
    {
      title: "Buyers Price",
      dataIndex: "price",
      render: (text, record) => (
        <div style={{ color: "gray" }}>
          {record.price_after_discount ? (
            <div>{toIndianCurrency(record.price_after_discount)}</div>
          ) : (
            toIndianCurrency(text)
          )}
        </div>
      ),
    },
    {
      title: "Discount Applied",
      dataIndex: "discount_",
      render: (text, record) => {
        return (
          <div
            style={{
              backgroundColor: "#FFFEEF",
              padding: "10px",
              width: "60px",
              fontStyle: "italic",
              fontWeight: "600",
              borderRadius: "4px",
            }}
          >
            {record.discount_details &&
            record.discount_details.type === "Rupees"
              ? "₹ "
              : ""}
            {record.discount_details && record.discount_details.value
              ? record.discount_details.value
              : "N/A"}
            {record.discount_details &&
            record.discount_details.type === "Percent"
              ? " %"
              : ""}
          </div>
        );
      },
    },
    // {
    //   title: "QTY Amount",
    //   dataIndex: "qty_amount",
    //   render: (text) => <>{toIndianCurrency(text)} </>,
    // },
    {
      title: "GST %",
      dataIndex: "gst",
      render: (text) => <div>{text} % </div>,
    },
    {
      title: "Total",
      dataIndex: "total_price",
      render: (text) => <>{toIndianCurrency(text)} </>,
    },
  ];

  const discountAmountStyle = {
    textAlign: "right",
    color: "green",
    width: "100px",
    padding: " 4px 5px 4px 4px",
    borderRadius: " 5px",
    float: "right",
    background: "rgb(206, 240, 213)",
  };
  const totaldiscountStyle = {
    textAlign: "right",
    color: "green",
    width: "100px",
    padding: " 4px 5px 4px 4px",
    borderRadius: " 5px",
    float: "right",
    background: "rgb(206, 240, 213)",
    fontWeight: "bold",
  };

  return (
    <Drawer
      className="container"
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <CloseOutlined onClick={onClose} />
            &nbsp;&nbsp;&nbsp; <span>
              Order Details : {orderView.order_id}
            </span>{" "}
          </div>
          {orderView.purchase_order_url ? (
            <div>
              {orderView.delivery_status === "Shipped" ||
              orderView.delivery_status === "Approved" ||
              orderView.delivery_status === "Processing" ||
              orderView.delivery_status === "Partial Shipped" ? (
                <a
                  style={{
                    background: "#1677ff",
                    height: "32px",
                    borderRadius: "6px",
                    width: "100%",
                    paddingLeft: "20px",
                  }}
                  href={orderView.purchase_order_url}
                >
                  Download
                </a>
              ) : (
                ""
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      }
      width={950}
      closable={false}
      onClose={onClose}
      open={orderViewOpen}
      style={{ overflowY: "auto" }}
    >
      {orderView ? (
        <>
          {/* <table style={{ width: "100%", position: "relative" }}> */}
          {/* <tr> */}{" "}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <p>
                  {" "}
                  Customer Name :{" "}
                  <span
                    style={{
                      color: "rgb(8, 134, 210)",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {orderView.customer.name}{" "}
                  </span>{" "}
                </p>
                <p>
                  Order No. :{" "}
                  <span
                    style={{
                      color: "rgb(8, 134, 210)",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    {orderView.order_id}
                  </span>{" "}
                </p>
                <p>
                  Order Date :{" "}
                  <span
                    style={{
                      color: "rgb(8, 134, 210)",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {moment(orderView.created_at).format("DD-MMM-YYYY")}
                  </span>
                </p>
                <p>
                  {" "}
                  Order By :{" "}
                  <span
                    style={{
                      color: "rgb(8, 134, 210)",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {orderView.created_by.first_name}
                  </span>
                </p>
                {orderView.fullfilled_by && (
                  <p>
                    {" "}
                    Fulfilled by :{" "}
                    <span
                      style={{
                        color: "rgb(8, 134, 210)",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {orderView.fullfilled_by &&
                        orderView.fullfilled_by.contact_person_name}
                    </span>
                    <span
                      style={{
                        color: "rgb(8, 134, 210)",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {orderView.customer_level_name
                        ? `( ${orderView.customer_level_name} )`
                        : ""}
                    </span>
                  </p>
                )}
                {orderView.delivery_status === "Rejected" ? (
                  <p>
                    {" "}
                    Reject Reason :
                    <span
                      style={{
                        color:
                          orderView.delivery_status === "Rejected" ? "red" : "",
                        textAlign: "center",
                        padding: " 4px",
                        fontSize: "13px",
                        borderRadius: " 8px",
                      }}
                    >
                      * {orderView.reject_reason}
                    </span>
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div>
              <div style={{ textAlign: "right" }}>
                {orderView.delivery_status === "Approved" ||
                orderView.delivery_status === "Received" ||
                orderView.delivery_status === "Processing" ? (
                  <>
                    {editOrderPermission ? (
                      <Button
                        type="primary"
                        style={{
                          // position: "absolute",
                          right: 0,
                          top: -10,
                        }}
                        onClick={() => {
                          handleEditOder(orderView, () =>
                            navigate(
                              `/web/order/update-order/?getOrder=${orderView.id}&name=${orderView.customer.name}&id=${orderView.customer.id}`
                            )
                          );
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <span>
                  <p style={{ display: "flex" }}>
                    Payment Status :&ensp;
                    <span
                      style={{
                        color: "rgb(8, 134, 210)",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {orderView &&
                      orderView.payment_option_check === "PAY_ON_DELIVERY"
                        ? "Pay On Delivery"
                        : orderView.payment_option_check === "FULL_ADVANCE"
                        ? "Full Advance"
                        : orderView.payment_option_check === "PARTIAL_ADVANCE"
                        ? "Partial Advance"
                        : orderView.payment_option_check === "CREDIT_DAYS"
                        ? " Credit Days"
                        : ""}
                    </span>
                  </p>
                  {orderView.remaining_payment_days > 0 ? (
                    <p style={{ display: "flex" }}>
                      Remaining payment days :
                      <span
                        style={{
                          color: "rgb(8, 134, 210)",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        &ensp;{orderView.remaining_payment_days} Days
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    Order Status :{" "}
                    <span
                      style={{
                        textAlign: "right",
                        padding: " 4px 10px",
                        borderRadius: " 8px",
                        marginLeft: 4,
                        fontWeight: "600",
                        background:
                          orderView.delivery_status === "Received" ||
                          orderView.delivery_status === "Pending"
                            ? "#ffcc80"
                            : orderView.delivery_status === "Delivered"
                            ? "#f6ffed"
                            : orderView.delivery_status === "Rejected"
                            ? "#fff1f0"
                            : orderView.delivery_status === "Approved"
                            ? "#eee5ff"
                            : orderView.delivery_status === "Processing"
                            ? "#8080ff"
                            : orderView.delivery_status === "Shipped"
                            ? "#f6ffed"
                            : orderView.delivery_status === "Partial Shipped"
                            ? "#f6ffed"
                            : "#dfe7ff",
                        color:
                          // orderView.delivery_status === "Approved" ? "rgb(255, 255, 255)" : ''
                          orderView.delivery_status === "Received" ||
                          orderView.delivery_status === "Pending"
                            ? "#b3555a"
                            : orderView.delivery_status === "Delivered"
                            ? "green"
                            : orderView.delivery_status === "Rejected"
                            ? "red"
                            : orderView.delivery_status === "Approved"
                            ? "purple"
                            : orderView.delivery_status === "Processing"
                            ? "white"
                            : orderView.delivery_status === "Shipped"
                            ? "green"
                            : "gray",
                      }}
                    >
                      {orderView.delivery_status}{" "}
                    </span>
                  </p>
                  {orderView.delivery_status === "Shipped" ? (
                    <p style={{ display: "flex" }}>
                      <span
                        style={{
                          color: "red",
                          textAlign: "center",
                          fontWeight: "600",
                          background: "#ffdbdb",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        {orderView.is_closed ? "Closed" : ""}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div style={{ lineHeight: "10px" }}>
            <strong>
              <p>
                {" "}
                <span style={{ color: "black", textAlign: "center" }}>
                  {orderView.items.length}
                </span>{" "}
                Items{" "}
              </p>
            </strong>
            <Table
              columns={columns}
              dataSource={orderView.items !== "" ? orderView.items : ""}
              pagination={false}
            ></Table>
          </div>
          <div>
            <table style={{ width: "100%", position: "relative" }}>
              {orderView.comment ? (
                <>
                  <br />
                  <tr>
                    <b>Comments :</b>
                    <td>
                      <span>{orderView.comment}</span>
                    </td>
                  </tr>
                  <br />
                </>
              ) : (
                ""
              )}
              {orderView.admin_comment &&
              cookies.get("rupyzAccessType") === "WEB_SARE360" ? (
                <tr>
                  <b>Admin Note :</b>
                  <td>
                    <span>{orderView.admin_comment}</span>
                  </td>
                </tr>
              ) : (
                ""
              )}
              <tr>
                <br />
                <strong>
                  <div style={{ fontSize: "15px" }}>Order Summary</div>
                </strong>
              </tr>
              <tr>
                <br />
                <div>Order Amount :</div>
                <td style={{ textAlign: "right" }}>
                  <span>{toIndianCurrency(orderView.amount)} </span>
                </td>
              </tr>
              <tr>
                <div>GST Amount : </div>
                <td style={{ textAlign: "right" }}>
                  <span>
                    {toIndianCurrency(orderView.items[0].gst_amount)}{" "}
                  </span>
                </td>
              </tr>
              {orderView.discount_details.length !== 0 ? (
                <tr>
                  <br />
                  <strong>
                    <div style={{ fontSize: "15px" }}>Discount Details </div>
                  </strong>
                </tr>
              ) : (
                ""
              )}
              {orderView.discount_details.map((discountDetails, index) => (
                <tr key={discountDetails.index}>
                  <td>
                    <div>{discountDetails.name} </div>
                    {discountDetails.type === "PERCENT" ? (
                      <span>({discountDetails.value}%)</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={discountAmountStyle}>
                      {toIndianCurrency(discountDetails.calculated_value)}
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <div>Total Discount : </div>
                </td>
                <td>
                  <span style={totaldiscountStyle}>
                    {toIndianCurrency(orderView.discount_amount)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <br />{" "}
                  <div>
                    <strong> Delivery Charge : </strong>{" "}
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    <span>{toIndianCurrency(orderView.delivery_charges)}</span>
                  </strong>
                </td>
              </tr>
              <tr>
                {" "}
                <td>
                  {" "}
                  <br />{" "}
                  <div>
                    {" "}
                    <strong> Total Amount :</strong>{" "}
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  {" "}
                  <strong>
                    <span>{toIndianCurrency(orderView.total_amount)}</span>
                  </strong>
                </td>
              </tr>
            </table>
            {orderView.dispatch_history_list.length > 0 ? (
              <DispatchHistory
                data={orderView.dispatch_history_list}
                order_id={orderView.id}
              />
            ) : (
              <></>
            )}
          </div>
          <div>
            <strong>
              <p style={{ fontSize: "15px" }}>Order Images</p>
            </strong>

            <div className={styles.img_view}>
              {orderView &&
                orderView.order_images_info &&
                orderView.order_images_info.map((data, index) => {
                  return (
                    <div
                      style={{ position: "relative" }}
                      className={styles.view_img_preview_container}
                    >
                      <div>
                        <img
                          width="88px"
                          height="88px"
                          style={{ margin: "6px 6px 2px 6px" }}
                          src={data.url}
                        />
                      </div>
                      <img
                        width={30}
                        src={eyeIcon}
                        alt="View"
                        className={styles.view_img_preview}
                        onClick={() => {
                          setPreviewOpen(true);
                          setPreviewImage(data.url);
                        }}
                      />{" "}
                    </div>
                  );
                })}
            </div>
          </div>
          <div>
            <strong>
              <p style={{ fontSize: "15px" }}>Delivery Address</p>
            </strong>
            <Card>
              <div>
                <span
                  style={{
                    backgroundColor: "rgb(49, 43, 129)",
                    color: "white",
                    padding: "5px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                >
                  {orderView.address.name}
                </span>
                <p style={{ fontWeight: "bold" }}>
                  {orderView.address.address_line_1}
                </p>
                <div></div>
                <p>
                  {orderView.address.city} {orderView.address.state}{" "}
                  {orderView.address.pincode}
                </p>
                <p></p>
              </div>
            </Card>
          </div>
          <br />
          {orderView.delivery_status === "Received" &&
          orderStatusUpdatePermission ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{
                    width: "49%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Approved");
                  }}
                >
                  Approve
                </Button>
                <Button
                  style={{ width: "49%" }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
              <br />
            </div>
          ) : orderView.delivery_status === "Approved" &&
            orderStatusUpdatePermission ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{
                    width: "24%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Processing");
                  }}
                >
                  Processing
                </Button>
                <Button
                  style={{
                    width: "24%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Ready to dispatch");
                  }}
                >
                  Ready to dispatch
                </Button>
                <Button
                  style={{
                    width: "24%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Shipped");
                    setShippedOrderData(orderView);
                  }}
                >
                  Dispatch
                </Button>
                <Button
                  style={{ width: "24%" }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
              <br />
            </>
          ) : orderView.delivery_status === "Processing" &&
            dispatchOrderPermission ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {" "}
                <Button
                  style={{
                    width: "32%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Ready to dispatch");
                  }}
                >
                  Ready to dispatch
                </Button>
                <Button
                  style={{
                    width: "32%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Shipped");
                    setShippedOrderData(orderView);
                  }}
                >
                  Dispatch
                </Button>
                <Button
                  style={{ width: "32%" }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Rejected");
                  }}
                >
                  Rejected
                </Button>
              </div>
              <br />
            </>
          ) : orderView.delivery_status === "Ready To Dispatch" &&
            dispatchOrderPermission ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{
                    width: "49%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Shipped");
                    setShippedOrderData(orderView);
                  }}
                >
                  Dispatch
                </Button>
                <Button
                  style={{ width: "49%" }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Rejected");
                  }}
                >
                  Rejected
                </Button>
              </div>
              <br />
            </>
          ) : orderView.delivery_status === "Partial Shipped" &&
            dispatchOrderPermission ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{
                    width: "49%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Shipped");
                    setShippedOrderData(orderView);
                  }}
                >
                  Dispatch
                </Button>
                <Button
                  style={{
                    width: "49%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Delivered");
                  }}
                >
                  Delivered
                </Button>
                {/* <Button
                    style={{ width: "32%" }}
                    size="large"
                    onClick={() => {
                      handleStatusChange("Rejected");
                    }}
                  >
                    Rejected
                  </Button> */}
              </div>
              <br />
            </>
          ) : orderView.delivery_status === "Shipped" &&
            dispatchOrderPermission ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{
                    width: "100%",
                    background: "green",
                    color: "white",
                  }}
                  size="large"
                  onClick={() => {
                    handleStatusChange("Delivered");
                  }}
                >
                  Delivered
                </Button>
                {/* <Button
                    style={{ width: "49%" }}
                    size="large"
                    onClick={() => {
                      handleStatusChange("Rejected");
                    }}
                  >
                    Rejected
                  </Button> */}
              </div>
              <br />
            </>
          ) : (
            <></>
          )}
          {showRejectReason ? (
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex" }}>
                <b style={{ width: 200 }}>Reject Reason : </b>{" "}
                <TextArea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <br />
              <br />
              <Button
                type="primary"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 200,
                }}
                onClick={() =>
                  dispatch(
                    updateStatus(orderView.id, {
                      delivery_status: "Rejected",
                      reject_reason: rejectReason,
                    })
                  )
                }
              >
                Submit
              </Button>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div style={{ fontSize: 30, fontWeight: 600 }}>No Data Available</div>
      )}
      <ModalForImagePreview />
    </Drawer>
  );
};
export default OrderView;
