import { useContext, useEffect, useState } from "react";
import Context from "../../context/Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, DeleteIcon, EditIcon } from "../../assets/globle";
import { deleteFollowUpReminder } from "../../redux/action/reminder";
import { Dropdown, Modal } from "antd";
import CustomerDetailCard from "../viewDrawer/distributor-details/customerDetailCard";
import { MoreOutlined } from "@ant-design/icons";
import { customerDetails } from "../../redux/action/customerAction";
import styles from "./reminder.module.css";
import moment from "moment";
import { formatTime } from ".";
import { imgFormatCheck } from "../../helpers/globalFunction";
import pdfIcon from "../../assets/defaultPdf.svg";
import ConfirmDelete from "../confirmModals/confirmDelete";
import RecordPayment from "../viewDrawer/recordPayment";
import RecordActivityComponent from "../activityModal/recordActivity";
import CheckInCustomer from "../../views/distributor/checkIn";

const DetailReminderModal = ({ isOpen, isClose, data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { disributor_details, singleLeadDataAction } = state;
  const context = useContext(Context);
  const {
    setDeleteModalOpen,
    deleteModalOpen,
    setAttendanceModalAction,
    setReminderIsOpen,
  } = context;
  const [editActivityData, setEditActivityData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const isCustomerClient = searchParams.get("customer_client");

  const onClose = () => {
    isClose(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => {
            setAttendanceModalAction({
              open: true,
              handleAction: () => {
                setEditActivityData({
                  ...data,
                });
              },
            });
          }}
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

  // delete function
  const handleDeleteCustomer = (value) => {
    if (value === true) {
      data.id && dispatch(deleteFollowUpReminder(data.id));
    }
  };

  useEffect(() => {
    if (disributor_details.data && !disributor_details.data.data.error) {
      setCustomerData(disributor_details.data.data.data);
    }
    if (singleLeadDataAction.data && !singleLeadDataAction.data.data.error) {
      setCustomerData(singleLeadDataAction.data.data.data);
    }
  }, [state]);

  return (
    <Modal
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            position: "relative",
          }}
        >
          {isCustomerClient && (
            <img
              src={ArrowLeft}
              alt="back"
              style={{
                cursor: "pointer",
                position: "absolute",
                left: 20,
                marginTop: 5,
              }}
              onClick={() => {
                navigate(-1);
                dispatch(customerDetails(data.module_id));
              }}
            />
          )}
          Reminder
        </div>
      }
      width={550}
      onCancel={onClose}
      open={isOpen}
      centered
      footer={[]}
    >
      <div className={styles.modal_container}>
        {data?.module_type?.split(" ")[0] === "Lead" ? (
          <></>
        ) : (
          <>
            <CustomerDetailCard
              data={customerData}
              showDropdown={false}
              hideActionButton={true}
            />
            <div style={{ margin: "10px 0 20px 0" }}>
              <CheckInCustomer
                detail={customerData}
                onCallingOrder={() => {
                  onClose();
                  setReminderIsOpen(false);
                }}
                onCheckOutAction={onClose}
              />
            </div>
          </>
        )}
        <div className={styles.modal_head}>
          <div style={{ wordBreak: "break-word" }}>{data.feedback_type}</div>
          <Dropdown
            menu={{
              items,
            }}
            className="action-dropdown"
          >
            <div className="clickable">
              <MoreOutlined
                className="action-icon"
                style={{ color: "#6A6A6A" }}
              />
            </div>
          </Dropdown>
        </div>
        <div className={styles.modal_time_stamp}>
          {moment(data.due_datetime).format("DD MMM YY ")}{" "}
          {formatTime(data.due_datetime)}
        </div>
        <div
          style={{ display: data.comments ? "" : "none" }}
          className={styles.modal_comment}
        >
          <label>Comment</label>
          <div>{data.comments}</div>
        </div>
        <div
          className={styles.modal_img}
          style={{ display: data.pics_urls?.length !== 0 ? "" : "none" }}
        >
          <label>Images</label>
          <div
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          >
            {data.pics_urls?.map((ele, index) => {
              let type = imgFormatCheck(ele.url);
              return type ? (
                <img
                  src={ele.url}
                  alt="profile"
                  height={100}
                  style={{ borderRadius: 10, margin: 10 }}
                  key={index}
                />
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
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <ConfirmDelete
        title={"Follow up Reminder"}
        open={deleteModalOpen}
        confirmValue={(rowData) => {
          handleDeleteCustomer(rowData);
          setDeleteModalOpen(rowData);
        }}
      />
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
        }}
      />
    </Modal>
  );
};

export default DetailReminderModal;
