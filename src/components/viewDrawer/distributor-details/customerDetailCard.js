import Address from "./address";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import Context from "../../../context/Context";
import { ViewDetails } from "../../../assets";
import { Dropdown, Modal, Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import Permissions from "../../../helpers/permissions";
import handleParams from "../../../helpers/handleParams";
import whatsappIcon from "../../../assets/whatsapp.svg";
import { getDownLevelDetails } from "./viewCustomerDetails";
import { DeleteIcon, EditIcon } from "../../../assets/globle";
import paymentIcon from "../../../assets/distributor/payment.svg";
import orderIcon from "../../../assets/staffImages/orderIcon.svg";
import activityIcon from "../../../assets/distributor/activity.svg";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import { deleteCustomer } from "../../../redux/action/customerAction";
import TranferPopupConfirmation from "../../../views/distributor/tranferPopup";
import RecordActivityComponent from "../../activityModal/recordActivity";
import filterService from "../../../services/filter-service";
import cartService from "../../../services/cart-service";
import RecordPayment from "../recordPayment";

export default function CustomerDetailCard({
  data,
  isCustomerClient = false,
  fromBeat = false,
  showDropdown = true,
  size = "large",
  hideActionButton = false,
  removeButton = false,
  onRemove,
}) {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const {
    setCartNumber,
    recordActivityOpen,
    setDistributorDetails,
    customerDrawerFilters,
    setCustomerDrawerFilters,
    setOpenDistributorDrawer,
    setAttendanceModalAction,
  } = context;

  const [recordpaymentview, setRecordPaymentViewOpen] = useState({
    open: false,
    deatil: null,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const isCustomerClientParams = searchParams.get("customer_client");

  const [editActivityData, setEditActivityData] = useState({});
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [previewOpen, setPreViewOpen] = useState(false);

  const editCustomerPermission = Permissions("EDIT_CUSTOMER");
  const deleteCustomerPermission = Permissions("DELETE_CUSTOMER");
  let createPaymentPermission = Permissions("CREATE_PAYMENT");
  let createOrderPermission = Permissions("CREATE_ORDER");

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            if (fromBeat) {
              setOpenDistributorDrawer(true);
              navigate(`/web/customer?id=${data?.id}`);
              return;
            }
            handleParams(searchParams, setSearchParams, {
              view_details: true,
              id: data?.id,
            });
          }}
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    isCustomerClient &&
      !hideActionButton && {
        key: "2",
        label: (
          <div
            className="action-dropdown-list"
            onClick={() => {
              setRecordPaymentViewOpen({ open: true, detail: data });
              setDistributorDetails(data);
            }}
          >
            <img
              src={paymentIcon}
              alt="payment"
              style={{
                filter:
                  "saturate(0) grayscale(100%) sepia(10%) hue-rotate(0deg) brightness(100%) contrast(100%)",
              }}
            />
            Payment
          </div>
        ),
      },
    editCustomerPermission
      ? {
          key: "3",
          label: (
            <div
              onClick={() => {
                navigate(`/web/customer/add-customer?id=${data?.id}`);
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : {},
    deleteCustomerPermission && {
      key: "4",
      label: (
        <div>
          <div
            onClick={() => {
              setDistributorDetails(data);
              dispatch(
                deleteCustomer(data?.id, false, {
                  check_children: true,
                  is_customer_delete: true,
                })
              );
            }}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const handleCardClick = () => {
    if (isCustomerClient && !isActionsOpen && !previewOpen && !fromBeat) {
      handleParams(searchParams, setSearchParams, {
        customer_client: true,
        id: data?.id,
      });
      setCustomerDrawerFilters({
        ...customerDrawerFilters,
        activeTab: "insights",
      });
      return;
    }
  };

  useEffect(() => {
    if (
      state.deleteCustomer.data &&
      !state.deleteCustomer.data.data.error &&
      !state?.deleteCustomer?.data?.params?.check_children &&
      !isCustomerClient &&
      isCustomerClientParams
    ) {
      navigate(-1);
    }
  }, [state]);

  if (size === "small") {
    return (
      <div className={styles.customer_detail_card}>
        <CustomerLevelSideTag data={data} wordCount={12} />

        <div className={styles.customer_info_card}>
          <div
            className={styles.customer_detail}
            style={!removeButton ? { border: "none", paddingBlockEnd: 0 } : {}}
          >
            <img
              className={styles.customer_profile}
              src={data?.logo_image_url || customerIcon}
              alt="jpg"
            />
            <div className={styles.customer_basic_info}>
              <div className={styles.customer_name}>
                <Tooltip title={data?.name}>
                  <p>{data?.name}</p>
                </Tooltip>
              </div>
              <Address data={data} mapPinImg={true} />
              <div className={styles.contact_person}>
                <Tooltip title={data?.contact_person_name}>
                  <p>{data?.contact_person_name}</p>
                </Tooltip>
              </div>
            </div>
          </div>
          {removeButton && (
            <p
              onClick={() => onRemove(true)}
              style={{
                color: "rgba(255, 0, 0, 1)",
                fontWeight: 500,
                textAlign: "center",
                paddingTop: "14px",
                cursor: "pointer",
              }}
            >
              Remove
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.customer_detail_card}>
        <CustomerLevelSideTag data={data} />

        <div className={styles.customer_info_card}>
          <div
            className={
              hideActionButton
                ? styles.customer_detail
                : styles.customer_detail_border
            }
          >
            <img
              className={styles.customer_profile}
              src={data?.logo_image_url || customerIcon}
              alt="jpg"
              onClick={() => setPreViewOpen(true)}
              onMouseOver={() => isCustomerClient && setIsActionsOpen(true)}
              onMouseLeave={() => isCustomerClient && setIsActionsOpen(false)}
            />
            <div className={styles.customer_basic_info}>
              <div className={styles.customer_name}>
                <Tooltip title={data?.name}>
                  <p
                    style={{ cursor: isCustomerClient ? "pointer" : "" }}
                    onClick={handleCardClick}
                  >
                    {data?.name}
                  </p>
                </Tooltip>
                <div
                  onMouseOver={() => isCustomerClient && setIsActionsOpen(true)}
                  onMouseLeave={() =>
                    isCustomerClient && setIsActionsOpen(false)
                  }
                >
                  {showDropdown && (
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
                  )}
                </div>
              </div>
              <Address data={data} mapPinImg={true} />
              <div className={styles.contact_person}>
                <Tooltip title={data?.contact_person_name}>
                  <p>{data?.contact_person_name}</p>
                </Tooltip>
                <a
                  href={`https://wa.me/${data?.mobile}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img src={whatsappIcon} alt="whatsapp" />
                </a>
              </div>
              {!isCustomerClient && data?.customer_parent_name && (
                <div className={styles.customer_parent_details}>
                  <p
                    style={{ color: "#777777" }}
                    className={styles.customer_parent_level}
                  >
                    {
                      customerLevelList[
                        "LEVEL-" +
                          (data?.customer_level[
                            data?.customer_level?.length - 1
                          ] -
                            1)
                      ]
                    }
                  </p>
                  :
                  <p
                    style={{
                      color: "#312B81",
                      textDecoration: "underline",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                    className={styles.customer_parent_level}
                    onClick={() => {
                      handleParams(searchParams, setSearchParams, {
                        ...filterService.getFilters(),
                        id: data?.customer_parent,
                        customer_client: true,
                      });
                      setCustomerDrawerFilters({
                        ...customerDrawerFilters,
                        activeTab: "insights",
                      });
                    }}
                  >
                    {data?.customer_parent_name}
                  </p>
                </div>
              )}
            </div>
          </div>
          {!hideActionButton && (
            <div className={styles.more_actions}>
              <p
                className={
                  recordActivityOpen
                    ? styles.action_button_active
                    : styles.action_button
                }
                onClick={() => {
                  setAttendanceModalAction({
                    open: true,
                    handleAction: () => {
                      setEditActivityData({
                        module_id: data?.id,
                        module_type: "Customer Feedback",
                      });
                    },
                  });
                }}
                onMouseOver={() => isCustomerClient && setIsActionsOpen(true)}
                onMouseLeave={() => isCustomerClient && setIsActionsOpen(false)}
              >
                <img src={activityIcon} alt="activity" />
                Activity
              </p>
              {!isCustomerClient && createPaymentPermission && (
                <p
                  className={
                    recordpaymentview
                      ? styles.action_button_active
                      : styles.action_button
                  }
                  onClick={() => {
                    setAttendanceModalAction({
                      open: true,
                      handleAction: () => {
                        setRecordPaymentViewOpen({ open: true, detail: data });
                        setDistributorDetails(data);
                      },
                    });
                  }}
                >
                  <img src={paymentIcon} alt="payment" />
                  Payment
                </p>
              )}
              {createOrderPermission && (
                <p
                  className="button_primary"
                  onClick={() => {
                    setAttendanceModalAction({
                      open: true,
                      handleAction: () => {
                        setCartNumber(0);
                        cartService.initCart(data);
                        navigate(
                          `/web/distributor/product-list?id=${data?.id}&name=${data?.name}`
                        );
                      },
                    });
                  }}
                  onMouseOver={() => isCustomerClient && setIsActionsOpen(true)}
                  onMouseLeave={() =>
                    isCustomerClient && setIsActionsOpen(false)
                  }
                >
                  <img
                    src={orderIcon}
                    alt="order"
                    className={styles.order_img}
                  />
                  &nbsp; New Order
                </p>
              )}
            </div>
          )}
        </div>
        <Modal
          open={previewOpen}
          onCancel={() => setPreViewOpen(false)}
          closable={false}
          footer={""}
        >
          <div style={{ width: "100%", height: "70vh" }}>
            <img
              src={data?.logo_image_url || customerIcon}
              alt="img"
              style={{ width: "100%", height: "70vh", objectFit: "contain" }}
            />
          </div>
        </Modal>
      </div>
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
        }}
      />
      <RecordPayment {...{ recordpaymentview, setRecordPaymentViewOpen }} />
    </>
  );
}

export const getChildLevel = (details, key = "child") => {
  let level;
  if (details?.id) {
    level =
      "LEVEL-" +
      (Number(
        details?.customer_level[details?.customer_level?.length - 1] || 0
      ) +
        (key === "parent" ? -1 : 1));
  }
  if (level === "LEVEL-4") return "";
  return level;
};

export const getChildLevelName = (details, key = "child") => {
  const cookies = new Cookies();
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");
  return customerLevelList[getChildLevel(details, key)];
};

export const getCustomerCount = (details) => {
  const level = getChildLevel(details);
  return details[level?.split("-").join("_").toLowerCase() + "_customer_count"];
};

export const getParentLevel = (details) => {
  return (
    "LEVEL-" +
    (Number(details?.customer_level[details?.customer_level?.length - 1]) - 1)
  );
};

export const CustomerLevelSideTag = ({
  data,
  wordCount = 18,
  tagStyles = {},
}) => {
  const cookies = new Cookies();
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const backgroundColor = {
    backgroundColor:
      data?.customer_level === "LEVEL-1"
        ? "#FDE3C9"
        : data?.customer_level === "LEVEL-2"
        ? "#DFF3CE"
        : "#D1F2FB",
  };

  const sideTagText = () => {
    if (
      data?.customer_level_name?.length > wordCount ||
      customerLevelList[data?.customer_level]?.length > wordCount
    ) {
      return (
        (data?.customer_level_name?.slice(0, wordCount) ||
          customerLevelList[data?.customer_level]?.slice(0, wordCount)) + "..."
      );
    } else
      return (
        data?.customer_level_name || customerLevelList[data?.customer_level]
      );
  };
  return (
    <div
      className={styles.side_banner}
      style={{ ...backgroundColor, ...tagStyles }}
    >
      {sideTagText()}
    </div>
  );
};
