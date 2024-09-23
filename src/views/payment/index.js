import { Table, Select, Modal, Image, Tooltip, Space, Row, Col } from "antd";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  paymentAction,
  deletePayment,
  paymentActionById,
} from "../../redux/action/paymentAction";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import Context from "../../context/Context";
import UpdatePaymentStatus from "../../components/statusUpdate/updatePaymentStatus";
import Permissions from "../../helpers/permissions";
import Styles from "./payment.module.css";
import {
  ArrowLeft,
  DeleteCrossIcon,
  DeleteOutlineIcon,
  StoreFrontIcon,
} from "../../assets/globle";
import { Staff as staffIcon } from "../../assets/navbarImages";
import { staffDetailsById } from "../../redux/action/staffAction";
import { customerDetails } from "../../redux/action/customerAction";
import SearchInput from "../../components/search-bar/searchInput";
import pdfIcon from "../../assets/defaultPdf.svg";
import { imgFormatCheck } from "../../helpers/globalFunction";
import WrapText from "../../components/wrapText";
import Paginator from "../../components/pagination";
import filterService from "../../services/filter-service";
import { PaymentStatusView } from "../../components/statusView";
import AdminLayout from "../../components/AdminLayout";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const context = useContext(Context);
  const { deleteModalOpen, setDeleteModalOpen, setLoading } = context;
  const state = useSelector((state) => state);
  const [paymentList, setPaymentList] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    ...filterService.getFilters(),
  });

  const [showPaymentDetails, setShowPaymentDetails] = useState("");
  const [profileInfo, setProfileInfo] = useState();

  const { payment_images_info } = showPaymentDetails;

  let viewPaymentPermission = Permissions("VIEW_PAYMENT");
  let createPaymentPermission = Permissions("CREATE_PAYMENT");
  let paymentStatusUpdatePermission = Permissions("PAYMENT_STATUS_UPDATE");
  let editPaymentPermission = Permissions("EDIT_PAYMENT");
  let deletePaymentPermission = Permissions("DELETE_PAYMENT");

  const {
    customer_id,
    page,
    status,
    query: search,
    staff_id,
    id: payment_id,
  } = activeFilters;

  useEffect(() => {
    if (state.payment.data !== "") {
      if (state.payment.data.data.error === false)
        state.payment.data.data.data.map((ele) => {
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          ele.order_by =
            ele.created_by.first_name + " " + ele.created_by.last_name;
        });
      setPaymentList(state.payment.data.data.data);
      setLoading(false);
    }

    if (payment_id && state.paymentById.data !== "") {
      if (state.paymentById.data.data.error === false) {
        setShowPaymentDetails(state.paymentById.data.data.data);
      }
    }

    if (
      staff_id &&
      state.staff.data !== "" &&
      state.staff.data.data.error === false
    )
      setProfileInfo({
        name: state.staff.data.data.data.name,
        imgUrl: state.staff.data.data.data.profile_pic_url,
      });

    if (
      customer_id &&
      state.disributor_details.data !== "" &&
      state.disributor_details.data.data.error === false
    )
      setProfileInfo({
        name: state.disributor_details.data.data.data.name,
        imgUrl: state.disributor_details.data.data.data.logo_image_url,
      });
  }, [state]);

  //capitalizeFirst character
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDeletePayment = (id) => {
    let apiData = { is_archived: true };
    dispatch(deletePayment(apiData, id));

    setTimeout(() => {
      setDeleteModalOpen(false);
      navigate("/web/payment");
      dispatch(paymentAction(activeFilters));
      setLoading(false);
      setShowPaymentDetails("");
    }, 1000);
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "fullName",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "500", color: "#000" }}>
            {" "}
            {capitalizeFirst(text)}
          </div>
          {record.source === "STOREFRONT" && (
            <Tooltip
              placement="top"
              title={"The payment is recorded on the storefront."}
            >
              <div
                style={{ display: "flex", alignItems: "center", fontSize: 12 }}
              >
                <img src={StoreFrontIcon} alt="img" width={17} />
                <div>Storefront</div>
              </div>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      render: (text) => (
        <div style={{ color: "black" }}>{toIndianCurrency(text)}</div>
      ),
    },
    {
      title: "Entered By",
      dataIndex: "order_by",
      render: (text) => <div> {capitalizeFirst(text)}</div>,
    },

    {
      title: "Transaction Date",
      dataIndex: "transaction_timestamp",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY") : ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "key",
      width: 150,
      render: (text, record) => (
        <PaymentStatusView status={record.status} />
        // <div
        //   style={{
        //     textAlign: "center",
        //     background:
        //       record.status === "Dishonour"
        //         ? "#FFF1F0"
        //         : record.status === "Approved"
        //         ? "#F6FFED"
        //         : "#F4F4F4",
        //     color:
        //       record.status === "Dishonour"
        //         ? "red"
        //         : record.status === "Approved"
        //         ? "green"
        //         : "#727176",
        //     padding: "5px",
        //     borderRadius: "5px",
        //     border: "1px solid #FFF",
        //   }}
        // >
        //   {text === "Dishonour" ? "Rejected" : text}
        // </div>
      ),
    },
  ];

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  useEffect(() => {
    if (customer_id) {
      dispatch(customerDetails(customer_id));
    } else if (staff_id) {
      dispatch(staffDetailsById(staff_id));
    }
  }, [customer_id, staff_id]);

  useEffect(() => {
    dispatch(paymentAction(activeFilters));
  }, [status, page, search]);

  useEffect(() => {
    if (!window.location.search) {
      filterService.setFilters({ page: 1 });
    }
  }, [window.location.search]);

  // Delete modal
  const onCancel = () => {
    setDeleteModalOpen(false);
  };

  const callingActivityById = (id) => {
    if (id) {
      dispatch(paymentActionById(id));
    }
  };

  useEffect(() => {
    if (!payment_id) setShowPaymentDetails("");
    callingActivityById(payment_id);
  }, [payment_id]);

  return (
    <AdminLayout
      title={
        <>
          {(staff_id || customer_id) && (
            <img src={ArrowLeft} alt="back" onClick={() => navigate(-1)} />
          )}
          Payment List
        </>
      }
      subTitle={
        <>
          {staff_id && (
            <Col className={Styles.staff_img}>
              <img
                src={profileInfo?.imgUrl || staffIcon}
                alt={profileInfo?.name}
              />
              <p>{profileInfo?.name}</p>
            </Col>
          )}
        </>
      }
      search={{
        placeholder: "Search for Customer",
        searchValue: (data) => filterService.setFilters({ query: data }),
      }}
      panel={[
        <Select
          options={[
            { value: "", label: "All" },
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
            { value: "Dishonour", label: "Rejected" },
          ]}
          onChange={(e) => {
            setShowPaymentDetails("");
            filterService.setFilters({
              status: e,
              ...(activeFilters["id"] && { id: "" }),
            });
          }}
          value={activeFilters["status"] || ""}
          style={{ width: 200 }}
        />,
      ]}
    >
      <div className={Styles.table_container}>
        <Table
          columns={columns}
          style={{
            width: showPaymentDetails ? "69%" : "100%",
          }}
          {...(viewPaymentPermission && {
            pagination: false,
            dataSource: paymentList || "",
            onRow: (record, rowIndex) => ({
              onClick: () => {
                filterService.setFilters({
                  id: record.id,
                  page,
                });
              },
            }),
            className: "clickable",
            scroll: { y: 500 },
          })}
        />
        {showPaymentDetails && (
          <div className={Styles.card_view} style={{ width: "30%" }}>
            <img
              src={DeleteCrossIcon}
              alt="delete"
              className={Styles.cancelIcon}
              onClick={() => {
                filterService.setFilters({ id: "" });
                setShowPaymentDetails("");
              }}
            />
            <div className={Styles.name_row}>
              <div className={Styles.name_label}>
                <WrapText width={140}>
                  {showPaymentDetails.customer?.name}
                </WrapText>
              </div>
              <div className={Styles.value_css} style={{ textAlign: "end" }}>
                {deletePaymentPermission && (
                  <img
                    src={DeleteOutlineIcon}
                    alt={"delete"}
                    onClick={() => setDeleteModalOpen(true)}
                  />
                )}
              </div>
            </div>
            <div className={Styles.divider} />
            <div
              className={Styles.first_row}
              style={{ justifyContent: "space-between" }}
            >
              <div className={Styles.amount_row}>
                {showPaymentDetails !== ""
                  ? toIndianCurrency(showPaymentDetails?.amount)
                  : toIndianCurrency(paymentList[0]?.amount)}
              </div>
              <div>
                <UpdatePaymentStatus
                  record={showPaymentDetails}
                  filters={activeFilters}
                />
              </div>
            </div>
            <div className={Styles.divider} />
            <Space direction={"vertical"} size="large">
              <div className={Styles.row}>
                <div className={Styles.label}>Date :</div>
                <div className={Styles.value_css}>
                  {showPaymentDetails !== ""
                    ? moment(showPaymentDetails?.created_at).format(
                        "DD MMM YYYY"
                      )
                    : moment(paymentList[0]?.created_at).format("DD MMM YYYY")}
                </div>
              </div>
              {(showPaymentDetails?.payment_number ||
                paymentList[0]?.payment_number) && (
                <div className={Styles.row}>
                  <div className={Styles.label}>Payment ID :</div>
                  <div className={Styles.value_css}>
                    {showPaymentDetails !== ""
                      ? showPaymentDetails?.payment_number
                      : paymentList[0]?.payment_number}
                  </div>
                </div>
              )}
              {(showPaymentDetails?.transaction_ref_no ||
                paymentList[0]?.transaction_ref_no) && (
                <div className={Styles.row}>
                  <div className={Styles.label}>Transaction Ref :</div>
                  <div className={Styles.value_css}>
                    {showPaymentDetails !== ""
                      ? showPaymentDetails?.transaction_ref_no
                      : paymentList[0]?.transaction_ref_no}
                  </div>
                </div>
              )}
              {showPaymentDetails?.transaction_timestamp && (
                <div className={Styles.row}>
                  <div className={Styles.label}>Date :</div>
                  <div className={Styles.value_css}>
                    {showPaymentDetails?.transaction_timestamp
                      ? moment(
                          showPaymentDetails?.transaction_timestamp
                        ).format("DD-MMM-YYYY")
                      : ""}
                  </div>
                </div>
              )}
              <div className={Styles.row}>
                <div className={Styles.label}>Payment Mode :</div>
                <div className={Styles.value_css}>
                  {showPaymentDetails !== ""
                    ? showPaymentDetails?.payment_mode
                    : paymentList[0]?.payment_mode}
                </div>
              </div>
              <div className={Styles.row}>
                <div className={Styles.label}>Entered By :</div>
                <div className={Styles.value_css}>
                  {showPaymentDetails !== ""
                    ? showPaymentDetails?.created_by?.first_name
                    : paymentList[0]?.order_by}
                </div>
              </div>
              {showPaymentDetails.comment && (
                <div className={Styles.row}>
                  <div className={Styles.label}>Note / Comment :</div>
                  <div className={Styles.value_css}>
                    {showPaymentDetails.comment}
                  </div>
                </div>
              )}
              {payment_images_info.length > 0 && (
                <>
                  <div className={Styles.row}>
                    <div className={Styles.label}>Photos / Docs :</div>
                  </div>
                  <div
                    className={Styles.row}
                    style={{
                      overflowX: "auto",
                      padding: 12,
                      paddingTop: 0,
                    }}
                  >
                    {payment_images_info?.map((data, index) => {
                      let type = imgFormatCheck(data.url);
                      return (
                        <div className={Styles.view_img_preview_container}>
                          <div>
                            {type ? (
                              <div style={{ margin: "6px 6px 2px 6px" }}>
                                <Image
                                  preview={{
                                    mask: <div>Preview</div>,
                                  }}
                                  width="88px"
                                  height="88px"
                                  src={data.url}
                                  alt="ig"
                                />
                              </div>
                            ) : (
                              <a
                                href={data.url}
                                target="_blank"
                                className={Styles.download_link}
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
                                <img
                                  src={pdfIcon}
                                  alt="pdf"
                                  width={80}
                                  height={80}
                                />
                                {/* Document Link . (Click to Open) */}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {showPaymentDetails.reject_reason && (
                <div className={Styles.row}>
                  <div className={Styles.label}>Reject Reason :</div>
                  <div className={Styles.value_css}>
                    {showPaymentDetails.reject_reason}
                  </div>
                </div>
              )}
            </Space>
          </div>
        )}
      </div>
      <br />
      <br />
      <Paginator
        limiter={(paymentList || []).length < 30}
        value={activeFilters["page"]}
        onChange={(i) => {
          filterService.setFilters({
            page: i,
            ...(activeFilters["id"] && { id: "" }),
          });
        }}
      />

      <Modal
        centered
        open={deleteModalOpen}
        onCancel={onCancel}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Delete Payment
          </div>
        }
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
            <button
              className="button_primary"
              onClick={() => handleDeletePayment(showPaymentDetails?.id)}
            >
              Delete
            </button>
            <button
              className="button_secondary"
              style={{ marginRight: 20 }}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <p className={Styles.delet_p} style={{ margin: 20 }}>
          Are You Sure, You want to Delete Your Payment ?
        </p>
      </Modal>
    </AdminLayout>
  );
};

export default Payment;
