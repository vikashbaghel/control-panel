import { useEffect, useState } from "react";
import {
  addPreferencesAction,
  preferencesAction,
} from "../../../redux/action/preferencesAction";
import NotificationTable from "../notificationTable";
import { useDispatch, useSelector } from "react-redux";
import "./whatsappnotification.css";

export default function WhatsappNotification() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { performance } = state;

  const [orderStatusList, setOrderStatusList] = useState({});
  const [paymentStatusList, setPaymentStatusList] = useState({});

  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  useEffect(() => {
    if (performance.data && !performance.data.data.error) {
      setOrderStatusList(
        performance.data.data.data.whatsapp_notification_based_on_order_status
      );
      setPaymentStatusList(
        performance.data.data.data.whatsapp_notification_based_on_payment_status
      );
    }
  }, [state]);

  return (
    <div className="whatsapp_table_container">
      <div className="tables">
        <NotificationTable
          title="Order Status"
          statusList={orderStatusList}
          updateList={setOrderStatusList}
        />
        <NotificationTable
          title="Payment Status"
          statusList={paymentStatusList}
          updateList={setPaymentStatusList}
        />
      </div>
      <button
        className={`button_primary`}
        style={{
          alignSelf: "flex-end",
          width: 100,
          paddingLeft: 35,
        }}
        onClick={() =>
          dispatch(
            addPreferencesAction({
              whatsapp_notification_based_on_order_status: orderStatusList,
              whatsapp_notification_based_on_payment_status: paymentStatusList,
            })
          )
        }
      >
        Save
      </button>
    </div>
  );
}
