import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import total_sales_img from "../../../src/assets/total_sales.png";
import UpdateStatus from "../../helpers/updateStatus";
import OrderView from "./orderView";
import { orderViewAction } from "../../redux/action/orderViewAction";

const DistributorOrderView = ({ data }) => {
  const context = useContext(Context);
  const {
    setDistributorOrderViewOpen,
    distributorOrderViewOpen,
    setOrderViewOpen,
  } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [apiData, setApiData] = useState([]);

  const onClose = () => {
    setDistributorOrderViewOpen(false);
  };

  useEffect(() => {
    if (state.order_detail_byid.data !== "") {
      if (state.order_detail_byid.data.data.error === false) {
        setApiData(state.order_detail_byid.data.data.data);
      }
    }
  }, [state]);

  return (
    <>
      <>
        {data && (
          <Drawer
            className="container"
            title={
              <>
                <CloseOutlined onClick={onClose} /> <span>Total Sales</span>{" "}
              </>
            }
            width={500}
            closable={false}
            onClose={onClose}
            open={distributorOrderViewOpen}
            style={{ overflowY: "auto" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px dashed #d9d9d9dd",
                borderRadius: 5,
                padding: 20,
              }}
            >
              <img
                src={total_sales_img}
                alt="image"
                width={30}
                height={30}
                style={{ margin: "0 20px" }}
              ></img>
              <div>
                <div>Total Sales</div>
                <b>{toIndianCurrency(data.total_amount_sales)}</b>
              </div>
            </div>
            <br />
            <h3 style={{ margin: "10px 0" }}>Recent Orders</h3>
            <br />
            {apiData &&
              apiData.map((item, index) => (
                <>
                  <div
                    style={{
                      border: "1px solid #d9d9d9dd",
                      borderRadius: 5,
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "10px 5px",
                      }}
                    >
                      OrderID : {item.order_id}
                      <span>{item.created_at}</span>
                    </div>
                    <div
                      style={{
                        color: "#0886D2",
                        fontSize: 15,
                        fontWeight: 500,
                        margin: 5,
                      }}
                      className="clickable"
                      onClick={() => {
                        dispatch(orderViewAction(item.id));
                        setOrderViewOpen(true);
                      }}
                    >
                      {item.customer.name} , {item.customer.city}
                    </div>
                    <b style={{ color: "#312B81", margin: 5 }}>
                      Amount : {toIndianCurrency(item.total_amount)}
                    </b>
                    <div
                      style={{
                        color: "#787878",
                        margin: "10px 5px",
                        fontSize: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Ordered by : {item.orderBy}
                      <span>
                        <UpdateStatus record={item} />
                      </span>
                    </div>
                  </div>
                  <br />
                </>
              ))}
            <OrderView />
          </Drawer>
        )}
      </>
    </>
  );
};
export default DistributorOrderView;

const marginStyleForP = {
  margin: "5px",
  fontWeight: "bold",
};
