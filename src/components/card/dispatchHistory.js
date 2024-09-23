import { Card } from "antd";
import React, { useContext, useState } from "react";
import { DoubleRightOutlined } from "@ant-design/icons";
import Context from "../../context/Context";
import moment from "moment";
import DispatchHistoryView from "../viewDrawer/dispatchHistoryView";

const DispatchHistory = ({ data, order_id }) => {
  return (
    <div>
      <b>Dispatch History</b>
      <br />
      <br />
      <div>
        <div>
          <GetISTTime data={data} order_id={order_id} />
        </div>
        <br />
      </div>
    </div>
  );
};

export default DispatchHistory;

export const GetISTTime = ({ data, order_id }) => {
  const [idForDispatchHistory, setIdForDispatchHistory] = useState("");
  const context = useContext(Context);
  const { setDispatchHistoryViewOpen } = context;

  const calendar = (date) => {
    return moment(date).format("DD/MM/YYYY (hh:mm a)");
  };

  const handleApiCalling = (id) => {
    setDispatchHistoryViewOpen(true);
    setIdForDispatchHistory(id);
  };

  return (
    <div>
      {data &&
        data.map((item, index) => (
          <div>
            <Card
              className="clickable"
              onClick={() => handleApiCalling(item.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 200,
                  }}
                >
                  <div>{calendar(item.created_at)}</div>
                </div>
                <div>{item.created_by_name}</div>
                <div
                  style={{
                    width: 130,
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <DoubleRightOutlined />
                </div>
              </div>
            </Card>
            <br />
            <DispatchHistoryView
              date={calendar(item.created_at)}
              order_id={order_id}
              id={idForDispatchHistory}
            />
          </div>
        ))}
    </div>
  );
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
