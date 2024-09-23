import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./viewCustomer.module.css";
import { BlankOrderIcon } from "../../assets/staffImages/index.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { orderActionDetailsBYId } from "../../redux/action/getOrderDetalsByIdAction";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { OrderStatusView } from "../../components/statusView.js";
import CustomerOrderCard from "../../components/viewDrawer/distributor-details/customerOrderCard.js";

const OrderViewComponent = ({ name }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [customerOrderList, setCustomerOrderList] = useState([]);

  useEffect(() => {
    id && dispatch(orderActionDetailsBYId(id));
  }, [id]);

  useEffect(() => {
    if (state.order_detail_byid.data !== "") {
      if (state.order_detail_byid.data.data.error === false) {
        setCustomerOrderList(state.order_detail_byid.data.data.data);
      }
    }
  }, [state]);

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  // lenght function
  const orderLength = getObjectLength(customerOrderList);

  return (
    <>
      {orderLength > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          {customerOrderList &&
            customerOrderList.slice(0, 10).map((item, index) => {
              return (
                <CustomerOrderCard
                  key={index}
                  data={item}
                  refreshOrderList={false}
                  callBack={() => dispatch(orderActionDetailsBYId(id))}
                />
              );
            })}
          {orderLength > 10 && (
            <p
              className={styles.view_all}
              onClick={() => {
                navigate(`/web/order/order-list?customer_ids=${id}`);
              }}
            >
              View All
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            padding: "10px 20px",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            <img src={BlankOrderIcon} alt="Activity" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            doesn’t have any Orders
          </div>
        </div>
      )}
    </>
  );
};

export default OrderViewComponent;
