import React, { useEffect, useState } from "react";
import styles from "../report-lead/leadReport.module.css";
import { Tooltip } from "antd";
import { BASE_URL_V2, org_id } from "../../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Download } from "../../../assets/globle";
import { SyncOutlined } from "@ant-design/icons";
import moment from "moment";

const ReportListing = ({ moduleName, setInterface }) => {
  const cookies = new Cookies();

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filterValue, setFilterValue] = useState("");

  const findModuleName = () => {
    switch (moduleName) {
      case "ORDERS":
      case "ORDER_DETAILS":
        return "ORDERS,ORDER_DETAILS,ORDER_DUMP";
      case "EXPENSES_ALL_USER":
      case "EXPENSES_DETAIL_USER":
        return "EXPENSES_ALL_USER,EXPENSES_DETAIL_USER";
      case "ATTENDANCE_AGGREGATED":
      case "ATTENDANCE_LISTING_USER":
        return "ATTENDANCE_AGGREGATED,ATTENDANCE_LISTING_USER";
      case "LEAD_RANGE":
      case "LEAD_LISTING_USER":
        return "LEAD_RANGE,LEAD_LISTING_USER";
      case "STAFF_DETAILED_ACTIVITY":
      case "STAFF_SUMMARY_ACTIVITY":
        return "STAFF_DETAILED_ACTIVITY,STAFF_SUMMARY_ACTIVITY";
      default:
        return moduleName;
    }
  };

  const featchLeadReportAPI = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/`;
  const fetchData = async (page, search) => {
    const url = featchLeadReportAPI;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const module = findModuleName();
    const params = {
      page_no: page,
      module,
      status: search,
    };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  //   initial call for API and whenever page count changes
  useEffect(() => {
    fetchData(pageNo, filterValue).then((newData) =>
      setData(data.concat(newData))
    );
  }, [pageNo, filterValue]);

  useEffect(() => {
    if (setInterface) {
      setInterface({
        reset: () => {
          setData([]);
          setHasMore(true);
          setPageNo(1);
          fetchData(1, filterValue).then((newData) => setData(newData));
        },
      });
    }
  }, []);

  return (
    <div className={styles.report_container_section2}>
      <div className={styles.filter}>
        <select
          value={filterValue}
          onChange={(event) => {
            setFilterValue(event.target.value);
            setData([]);
          }}
        >
          <option value={""}>No Filter</option>
          {filter_value.map((ele, index) => (
            <option value={ele.value} key={index}>
              {ele.label}
            </option>
          ))}
        </select>
        <button
          className="button_secondary"
          onClick={() => {
            setData([]);
            setHasMore(true);
            setPageNo(1);
            fetchData(1, filterValue).then((newData) => setData(newData));
          }}
        >
          <SyncOutlined /> Refresh
        </button>
      </div>
      {data.length > 0 ? (
        <InfiniteScroll
          dataLength={data.length}
          next={handleLoadMore}
          hasMore={hasMore}
          height={"100vh"}
          loader={
            hasMore === true ? (
              <h4 style={{ textAlign: "center" }}>Loading...</h4>
            ) : (
              <></>
            )
          }
          scrollableTarget="scrollableDiv"
          className={styles.dropdown_container}
        >
          {data?.map((item, index) => {
            const dateformat = "DD MMM YYYY";
            let color =
              item["status"] === "COMPLETED"
                ? "#297B00"
                : item["status"] === "INITIATED"
                ? "#000073"
                : "#555555";
            let background =
              item["status"] === "COMPLETED"
                ? "#297b0040"
                : item["status"] === "INITIATED"
                ? "#0000732b"
                : "#5555553d";
            return (
              <div
                className={styles.report_card}
                key={index}
                id="scrollableDiv"
              >
                <div className={styles.card_header}>
                  <Tooltip title={item.report_name}>
                    <span className={styles.report_name}>
                      {item.report_name}
                    </span>
                  </Tooltip>
                  <div
                    style={{
                      color: color,
                      background: background,
                      border: "2px solid #fff",
                      borderRadius: 5,
                      padding: "3px 10px",
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </div>
                </div>
                <div className={styles.card_details}>
                  <div>
                    <div className={styles.date_group}>
                      {item.input_params.start_date &&
                      item.input_params.end_date ? (
                        <>
                          {moment(item.input_params.start_date).format(
                            dateformat
                          )}{" "}
                          -{" "}
                          {moment(item.input_params.end_date).format(
                            dateformat
                          )}
                        </>
                      ) : (
                        "Date: Not Provided"
                      )}
                    </div>
                    <div className={styles.created_by}>
                      Created by : {item.created_by_name}
                    </div>
                  </div>
                  {item.file_url && (
                    <a href={item.file_url}>
                      <img src={Download} alt="download" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div className={styles.report_card}>
          <div className={styles.card_header}>No Data Available</div>
        </div>
      )}
    </div>
  );
};

export default ReportListing;

const filter_value = [
  {
    label: "Initiated",
    value: "INITIATED",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Failed",
    value: "FAILED",
  },
];
