import React, { useEffect } from "react";
import styles from "./notification.module.css";
import { useState } from "react";
import { Divider, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotification,
  updateNotification,
} from "../../redux/action/pushNotification";
import NotificationModal from "./notificationModal";
import { useContext } from "react";
import Context from "../../context/Context";
import PaymentView from "../viewDrawer/viewPaymentDetail";
import OrderView from "../viewDrawer/orderView";
import { feedbackActivityById } from "../../redux/action/recordFollowUpAction";
import DispatchHistoryView from "../viewDrawer/dispatchHistoryView";
import { useNavigate } from "react-router-dom";
import ViewRecordActivityComponent from "../activityModal/viewRecordActivityModal";

const Notification = ({ isNotificationOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  const [newData, setNewData] = useState([]);
  const [open, setOpen] = useState(false);
  const context = useContext(Context);
  const {
    setEditDistributorData,
    setRecordActivityViewOpen,
    setIsNotificationOpen,
    setReminderIsOpen,
  } = context;

  useEffect(() => {
    dispatch(getNotification(1));
  }, []);

  useEffect(() => {
    if (state.getNotification.data !== "") {
      if (state.getNotification.data.data.error === false) {
        setNewData(state.getNotification.data.data.data);
      }
    }
  }, [state]);

  const handleIsSeen = (id) => {
    dispatch(updateNotification(id));
    setTimeout(() => {
      dispatch(getNotification(1));
    }, 400);
    if (id === undefined) {
      for (let index = 0; index < newData.length; index++) {
        setTimeout(() => {
          Object.assign(newData[index], {
            is_seen: true,
          });
        }, 500);
      }
    }
  };

  useEffect(() => {
    if (state.disributor_details.data !== "") {
      if (state.disributor_details.data.data.error === false)
        setEditDistributorData(state.disributor_details.data.data.data);
    }
  }, [state]);

  const fetchDetails = (item) => {
    switch (item.payload.module_name) {
      case "ORDER":
        navigate(`/web/order/order-details?id=${item.payload.module_uid}`);
        break;
      case "ORDER-DISPATCH":
        navigate(
          `/web/order/order-details?id=${item.payload.parent_module_uid}&dispatch=${item.payload.module_uid}`
        );
        break;
      case "LEAD":
        navigate(`/web/view-lead/?id=${item.payload.module_uid}`);
        break;
      case "CUSTOMER-PAYMENT":
        navigate(`/web/payment/?id=${item.payload.module_uid}`);
        break;
      default:
        dispatch(feedbackActivityById(item.payload.parent_module_uid));
        setRecordActivityViewOpen(true);
        break;
    }
  };

  return (
    <div
      className={`${styles.notification_container} ${
        isNotificationOpen ? styles.isOpen : ""
      }`}
    >
      <ViewRecordActivityComponent />
      <h3>Notification</h3>
      <div className={styles.seen_all_buttons}>
        <span onClick={() => setOpen(true)}>See All</span>
        <span onClick={() => handleIsSeen()}>Mark Seen All</span>
      </div>
      <Divider style={{ margin: " 0", marginTop: 5 }} />
      {newData.results &&
        newData.results.map((data, index) => {
          let isSeen = data.is_seen;
          return (
            <div
              key={index}
              className={styles.notification_group}
              style={{
                background: !isSeen ? "#F0F6FF" : "",
                borderRadius: 5,
                padding: 3,
              }}
            >
              <div
                className="clickable"
                onClick={() => {
                  handleIsSeen(data.id);
                  fetchDetails(data);
                  setIsNotificationOpen(false);
                  setReminderIsOpen(false);
                  // data.module_name == "CUSTOMER-ORDER" ? navigate(`/web/distributor`) :<></>
                }}
              >
                <Date date={data.created_at} />
                <div className={styles.header}>{data.title}</div>
                <div className={styles.description}>{data.description}</div>
              </div>
            </div>
          );
        })}
      <Modal
        title={
          <h2 style={{ paddingLeft: 35, marginBottom: 0, paddingTop: 20 }}>
            Notifications
          </h2>
        }
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={600}
        footer={[<></>]}
        className="notification"
      >
        <NotificationModal />
      </Modal>
      <OrderView />
      <PaymentView />

      <DispatchHistoryView />
    </div>
  );
};

export default Notification;

export const Date = ({ date }) => {
  if (!date) return;
  let comingDate = date.slice(0, 10);
  comingDate = comingDate.split("-");
  const day =
    comingDate[2] +
    "-" +
    months[parseInt(comingDate[1] - 1)] +
    "-" +
    comingDate[0];
  let time = date.slice(11, 16);
  time = time.split(":");
  time = `${time[0]} : ${time[1]} ${time[0] >= "12" ? "pm" : "am"}`;

  return <div className={styles.date}>{day}</div>;
};

const months = [
  "Jan.",
  "Feb.",
  "March",
  "April",
  "May",
  "June ",
  "July ",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];
