import React, { useContext, useEffect, useState } from "react";
import styles from "./oderDetails.module.css";
import { useNavigate } from "react-router-dom";
import FormStepper from "../../components/formStepper/formStepper";
import { useDispatch, useSelector } from "react-redux";
import { dispatchHistory as dispatchHistoryAPI } from "../../redux/action/orderAction";
import { orderViewAction } from "../../redux/action/orderViewAction";
import moment from "moment";
import { capitalizeFirstLetter } from "../roles-permission/staffRolesPermision";
import { Table } from "antd";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import Permissions from "../../helpers/permissions";
import { handleEditOder } from "../../helpers/globalFunction";
import Context from "../../context/Context";
import SearchInput from "../../components/search-bar/searchInput";
import WrapText from "../../components/wrapText";
import { DispatchOrder } from "./dispatchHistory";
import Cookies from "universal-cookie";
import UpdateStatus from "../../components/statusUpdate/updateStatus";
import {
  ArrowLeft,
  Download,
  EditIcon,
  StoreFrontIcon,
} from "../../assets/globle";
import getValidAddress from "../../helpers/validateAddress";
import { imgFormatCheck } from "../../helpers/globalFunction";
import pdfIcon from "../../assets/defaultPdf.svg";
import { ImageViewer } from "../../components/image-uploader/ImageUploader";

const cookies = new Cookies();

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const dispatchId = queryParameters.get("dispatchId");
  const { orderView, dispatchHistory } = useSelector((state) => state);
  const { setAttendanceModalAction } = useContext(Context);
  const isAdmin = cookies.get("rupyzAccessType") === "WEB_SARE360";

  const [orderDetail, setOrderDetail] = useState({});
  const [dispatchDetails, setDispatchDetails] = useState({});
  const [tableSearch, setTableSearch] = useState("");

  const [previewImage, setPreviewImage] = useState({
    open: false,
    url: "",
  });

  const countDescription = {
    1: "Received",
    2: "Approved",
    3: "Processing",
    4: "Ready To Dispatch",
    5: "Partially Dispatched",
    6: "Dispatch",
    7: "Delivered",
  };

  const rejectDescription = { 1: "Received", 2: "Rejected" };

  const tableList = [
    {
      title: "Product Details",
      dataIndex: " ",
      key: "1",
      width: "350px",
      className: "tabe_border",
      render: (text, record) => (
        <div className={styles.table_name}>
          <img src={record.display_pic_url} alt="product" />
          <div>
            <div>
              {record.code} | GST : {record.gst}%
            </div>
            <div style={{ fontSize: 14, color: "#000" }}>
              <WrapText width={220}>{record.name}</WrapText>
            </div>
            <div>
              {record.variant_name && record.variant_name + " | "}
              {record.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "2",
      align: "center",
      className: "tabe_border",
      render: (text, record) => (
        <div className={styles.table_qty}>
          <div style={{ color: "#000" }}>
            {text} x {record.packaging_unit}
          </div>
          <div>
            ({text * record.packaging_size} x {record.unit})
          </div>
        </div>
      ),
    },
    {
      title: "Rate ₹ (Excl. GSt)",
      dataIndex: " ",
      key: "3",
      className: "tabe_border",
      render: (text, record) => (
        <div className={styles.table_rate}>
          <div>
            <span>Piece : </span>
            <span>{record.price}</span>
          </div>
          <div>
            <span>Discount : </span>
            <span>{record.discount_value}</span>
          </div>
          <div>
            <span>Net Rate : </span>
            <span>{record.price_without_gst}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Net Amount  (₹)",
      dataIndex: "total_price_without_gst",
      key: "4",
      align: "right",
      className: "tabe_border",
      render: (text, record) => <div>{toIndianCurrency(text, 4)}</div>,
    },
    {
      title: "GST Amount  (₹)",
      dataIndex: "total_gst_amount",
      key: "5",
      align: "right",
      className: "tabe_border",
      render: (text, record) => <div>{toIndianCurrency(text, 4)}</div>,
    },
    {
      title: "Total Amount  (₹)",
      dataIndex: "total_price",
      key: "6",
      align: "right",
      className: "tabe_border",
      render: (text, record) => (
        <div style={{ color: "#000" }}>{toIndianCurrency(text, 4)}</div>
      ),
    },
  ];

  const handleSelectedLRCalling = (data) => {
    dispatch(dispatchHistoryAPI(data.order_id, data.id));
  };

  // Calling details API for edit
  useEffect(() => {
    dispatch(orderViewAction(id));
  }, [id]);

  // Calling Dispatch details API for Notification
  useEffect(() => {
    if (dispatchId) {
      handleSelectedLRCalling({ order_id: id, id: dispatchId });
    }
  }, [dispatchId]);

  // setting the incoming values from API request in initial State
  useEffect(() => {
    if (orderView.data && orderView.data.data.error === false) {
      setOrderDetail(orderView.data.data.data);
    }
    if (dispatchHistory.data && dispatchHistory.data.data.error === false) {
      setDispatchDetails(dispatchHistory.data.data.data);
    }
  }, [orderView, dispatchHistory]);

  const sumQuantitiesByPackagingUnit = (data) => {
    return data?.reduce((acc, item) => {
      const unit = item.packaging_unit;
      if (!acc[unit]) {
        acc[unit] = 0;
      }
      acc[unit] += item.qty;
      return acc;
    }, {});
  };

  let totalQuantity = sumQuantitiesByPackagingUnit(orderDetail.items) || {};

  const calculateActiveCount = (status) => {
    switch (status) {
      case "Received":
        return 1;
      case "Approved":
        return 2;
      case "Processing":
        return 3;
      case "Ready To Dispatch":
        return 4;
      case "Partial Shipped":
        return 5;
      case "Shipped":
        return 6;
      case "Delivered":
        return 7;
      case "Rejected":
        return 2;
    }
    return 3;
  };

  const paymentDetails = {
    "Payment Terms": capitalizeFirstLetter(orderDetail.payment_option_check),
    Amount: orderDetail.payment_details?.amount,
    Mode: orderDetail.payment_details?.payment_mode,
    "Transaction Ref.No": orderDetail.payment_details?.transaction_ref_no,
    ...(orderDetail.remaining_payment_days && {
      "Remaining Payment After": `${orderDetail.remaining_payment_days} Days`,
    }),
  };

  return (
    <div style={{ marginRight: 30, fontFamily: "Poppins" }}>
      <div className={styles.detail_header}>
        <div>
          <img
            src={ArrowLeft}
            alt="arrow"
            className="clickable"
            onClick={() => navigate(-1)}
          />
          Order Details
        </div>
        <FormStepper
          totalCount={orderDetail.delivery_status === "Rejected" ? 2 : 7}
          activeCount={calculateActiveCount(orderDetail.delivery_status)}
          size="small"
          description={
            orderDetail.delivery_status === "Rejected"
              ? rejectDescription
              : countDescription
          }
          error={orderDetail.delivery_status === "Rejected" ? true : false}
        />
      </div>
      <div className={styles.order_detail_section}>
        <div className={styles.order_detail_header}>
          <div>
            Order No.: #{orderDetail.order_id}{" "}
            {orderDetail.source === "STOREFRONT" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  color: "#727176",
                  gap: 5,
                }}
              >
                <img src={StoreFrontIcon} alt="img" width={22} />
                <div>Storefront</div>
              </div>
            )}
            {(orderDetail.delivery_status === "Rejected" ||
              orderDetail.delivery_status === "Delivered" ||
              orderDetail.is_closed) && (
              <span
                className={styles.status_button}
                style={
                  orderDetail.delivery_status === "Rejected"
                    ? { background: "#FEF0F1", color: "red" }
                    : { background: "#eefdf3", color: "#288948" }
                }
              >
                Closed
              </span>
            )}
          </div>
          <div>
            <a
              className="button_secondary"
              href={orderDetail.purchase_order_url}
              style={{
                width: 200,
                display: "flex",
                alignItems: "center",
                gap: 15,
              }}
            >
              <img src={Download} alt="download" />
              Download PDF
            </a>
            {orderDetail.delivery_status !== "Rejected" &&
              orderDetail.delivery_status !== "Delivered" && (
                <div>
                  <UpdateStatus
                    record={orderDetail}
                    color={"primary"}
                    orderId={orderDetail.id}
                  />
                </div>
              )}
          </div>
        </div>
        <div className={styles.order_detail_footer}>
          <div>
            {moment(orderDetail.created_at).format("DD MMM, YY | hh:mm A")}
          </div>

          <div>
            <span>Created by : </span>
            {orderDetail.created_by?.first_name || ""}{" "}
            {orderDetail.created_by?.last_name || ""}
          </div>

          {orderDetail.fullfilled_by && (
            <div style={{ display: "flex", gap: 5 }}>
              <span>Placed to : </span>
              <WrapText width={350}>{orderDetail.fullfilled_by?.name}</WrapText>
            </div>
          )}
        </div>
        <div style={{ paddingTop: ".5em" }}>
          <div
            className={styles.grey_banner}
            style={{ display: "flex", gap: 10 }}
          >
            {Object.keys(paymentDetails).map(
              (key, index) =>
                paymentDetails[key] && (
                  <>
                    {index > 0 && index < 5 && (
                      <div style={{ fontWeight: 500 }}>|</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 500 }}>{key} : </span>
                      <span style={{ color: "#000" }}>
                        {paymentDetails[key]}
                      </span>
                    </div>
                  </>
                )
            )}
          </div>
        </div>
      </div>
      <div className={styles.order_bill_section}>
        <div className={styles.bill_group}>
          <div className={styles.bill_head}>Buyer (Bill to)</div>
          <div className={styles.section_group}>
            <WrapText width={"90%"}>{orderDetail.customer?.name}</WrapText>
            <div>
              <div>
                {orderDetail.customer?.city}, {orderDetail.customer?.state}
              </div>
              {orderDetail.customer?.mobile && (
                <div>Mobile.: {orderDetail.customer?.mobile}</div>
              )}
              {orderDetail.customer?.email && (
                <div>E-mail Id : {orderDetail.customer?.email}</div>
              )}
              {orderDetail.customer?.gstin && (
                <div>GST : {orderDetail.customer?.gstin}</div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.delivery_group}>
          <div className={styles.delivery_head}>
            <span>Delivery Location (Ship to)</span>
            {orderDetail.expected_delivery_date && (
              <span className={styles.expected_date}>
                Expected Delivery Date :{" "}
                {moment(orderDetail.expected_delivery_date).format(
                  "DD MMM, YY"
                )}
              </span>
            )}
          </div>
          <div className={styles.section_group}>
            <div>{orderDetail.address?.name}</div>
            <div>
              {orderDetail.address &&
                getValidAddress({
                  ...orderDetail.address,
                  ...{
                    address_line_2: "",
                  },
                })}
              {orderDetail.purchase_order_number && (
                <div>
                  Purchase Order (PO) Number :{" "}
                  {orderDetail.purchase_order_number}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.product_section}>
        <div className={styles.table_header}>
          <div>{orderDetail.items?.length} Products</div>
          <div>
            <SearchInput
              placeholder="Search for Product"
              searchValue={(e) => setTableSearch(e)}
            />
            <EditButton
              {...{ orderDetail }}
              handleEditOrderAction={() => {
                setAttendanceModalAction({
                  open: true,
                  handleAction: () => {
                    handleEditOder(orderDetail, () =>
                      navigate(
                        `/web/order/update-order/?getOrder=${orderDetail.id}&name=${orderDetail.customer.name}&id=${orderDetail.customer.id}`
                      )
                    );
                  },
                });
              }}
            />
          </div>
        </div>
        <Table
          pagination={false}
          columns={tableList}
          dataSource={orderDetail.items?.filter(
            (item) =>
              item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
              item.code.toLowerCase().includes(tableSearch.toLowerCase())
          )}
          scroll={{ y: 500 }}
          style={{ fontWeight: 500 }}
        />
      </div>
      {orderDetail.dispatch_history_list?.length > 0 && (
        <div className={styles.dispatch_section}>
          <DispatchOrder
            {...{ orderDetail, dispatchDetails, setDispatchDetails }}
            callingDispatchDetail={(value) => handleSelectedLRCalling(value)}
          />
        </div>
      )}
      <div className={styles.discount_section}>
        <div>
          <div className={styles.discount_head}>Discounts</div>
          <div className={styles.discount_detail}>
            {orderDetail.discount_details?.length > 0
              ? orderDetail.discount_details?.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex" }}>
                      {index + 1}.
                      <WrapText width={200}>{` ${item.name} `}</WrapText> (
                      {item.value}
                      {item.type === "PERCENT" ? "%" : "₹"})
                    </div>
                    <div>{toIndianCurrency(item.calculated_value)}</div>
                  </div>
                ))
              : "N/A"}
          </div>
          <div className={styles.discount_head} style={{ marginTop: 10 }}>
            Other Charges
          </div>
          <div className={styles.discount_detail}>
            {orderDetail.charges_details?.length > 0
              ? orderDetail.charges_details?.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex" }}>
                      {index + 1}.
                      <WrapText width={200}>{` ${item.name} `}</WrapText>
                    </div>
                    <div>{item.value}</div>
                  </div>
                ))
              : "N/A"}
          </div>
        </div>
        <div>
          <div className={styles.discount_head}>
            Gross Amount : {toIndianCurrency(getValue.grossAmount(orderDetail))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#727176",
              paddingBlock: ".5em",
            }}
          >
            Total Discount:
            <span>{orderDetail.discount_amount}</span>
          </div>
          <div className={styles.discount_head}>
            Taxable Value : {toIndianCurrency(getValue.taxable(orderDetail))}
          </div>
          <div className={styles.discount_detail}>
            <div>
              SGST/UTGST : <span>{orderDetail.taxes_info?.sgst_amount}</span>
            </div>
            <div>
              CGST : <span>{orderDetail.taxes_info?.cgst_amount}</span>
            </div>
            <div>
              IGST : <span>{orderDetail.taxes_info?.igst_amount}</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
              margin: "5px 0",
            }}
          >
            Sub Total:
            <span>{toIndianCurrency(getValue.subTotal(orderDetail))}</span>
          </div>
          <div className={styles.discount_detail}>
            <div>
              Total Other Charges:
              <span>{orderDetail.delivery_charges}</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
              fontSize: 20,
              marginTop: 10,
            }}
          >
            Total Amount :
            <span>{toIndianCurrency(getValue.total(orderDetail))}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <div className={styles.total_quantity_section}>
          <div className={styles.quantity_head}>Total Quantity</div>
          <div className={styles.quantity_group}>
            {Object.keys(totalQuantity)?.length > 0 &&
              Object.keys(totalQuantity).map((key, index) => (
                <div key={key}>
                  {key} :{" "}
                  <span style={{ color: "#000" }}>
                    {totalQuantity[key]}{" "}
                    {Object.keys(totalQuantity).length !== index + 1 && ","}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.note_comment_section}>
          <div className={styles.note_comment_head}>Note / Comments</div>
          <div className={styles.note_group}>
            {isAdmin && orderDetail.admin_comment && (
              <div>Admin Comment : {orderDetail.admin_comment}</div>
            )}
            <div>Comment : {orderDetail.comment || "N/A"}</div>
          </div>
        </div>
      </div>
      {orderDetail.order_images_info?.length > 0 && (
        <div className={styles.attachment_section}>
          <div className={styles.attachment_head}>Attachments</div>
          <div>
            {orderDetail.order_images_info.map((ele, index) => {
              let type = imgFormatCheck(ele.url);
              return (
                <div className={styles.image_container}>
                  {type ? (
                    <div
                      style={{ margin: "6px 6px 2px 6px" }}
                      onClick={() =>
                        setPreviewImage({ open: true, url: ele.url })
                      }
                    >
                      <img src={ele.url} alt="img" />
                    </div>
                  ) : (
                    <a
                      href={ele.url}
                      target="_blank"
                      className={styles.download_link}
                      style={{
                        width: "88px",
                        height: "88px",
                        display: "flex",
                        justifyContent: "center",
                        border: "1px solid #e3e3e3",
                        borderRadius: "5px",
                        margin: "6px 6px 2px 6px",
                      }}
                    >
                      <img src={pdfIcon} alt="pdf" width={80} height={80} />
                      {/* Document Link . (Click to Open) */}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ImageViewer {...{ previewImage, setPreviewImage }} />
    </div>
  );
};

export default OrderDetails;

const EditButton = ({ orderDetail, handleEditOrderAction }) => {
  let editOrderPermission = Permissions("EDIT_ORDER");

  return (
    (orderDetail.delivery_status === "Approved" ||
      orderDetail.delivery_status === "Received" ||
      orderDetail.delivery_status === "Processing") &&
    editOrderPermission && (
      <button
        className="button_secondary"
        style={{ display: "flex", alignItems: "center" }}
        onClick={handleEditOrderAction}
      >
        <img src={EditIcon} alt="edit" style={{ marginRight: 10, width: 15 }} />
        Edit
      </button>
    )
  );
};

const getCalculation = (detail, value) => {
  switch (value) {
    case "taxable":
      return detail.amount;
    case "subTotal":
      return detail.gst_amount + detail.amount;
    case "total":
      return detail.total_amount;
    case "grossAmount":
      return detail.amount + detail.discount_amount;
  }
};
const getValue = {
  taxable: (detail) => getCalculation(detail, "taxable"),
  subTotal: (detail) => getCalculation(detail, "subTotal"),
  total: (detail) => getCalculation(detail, "total"),
  grossAmount: (detail) => getCalculation(detail, "grossAmount"),
};
