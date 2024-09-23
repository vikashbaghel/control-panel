import axios from "axios";
import moment from "moment";
import Cookies from "universal-cookie";
import { Drawer, Tooltip } from "antd";
import styles from "./styles.module.css";
import Context from "../../../context/Context";
import SalesDetailsTable from "./salesDetailsTable";
import { BASE_URL_V2, org_id } from "../../../config";
import { useContext, useEffect, useState } from "react";
import staffIcon from "../../../assets/navbarImages/staff.svg";
import noHistoricData from "../../../assets/globle/no-results.svg";
import SessionExpireError from "../../../helpers/sessionExpireError";
import noData from "../../../assets/activity-details-header/nodata.svg";

export default function SalesReportDrawer() {
  const cookies = new Cookies();

  const queryParameters = new URLSearchParams(window.location.search);

  const context = useContext(Context);
  const { salesReportDrawerOpen, setSalesDrawerOpen } = context;
  const { open, id } = salesReportDrawerOpen;

  const date = queryParameters.get("date");
  const [reportDetails, setReportDetails] = useState({});

  const handleClose = () => {
    setSalesDrawerOpen({ open: false, id: "" });
    setReportDetails({});
  };

  const fetchData = () => {
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/details/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { date, user_id: id };
    axios
      .get(url, { headers, params })
      .then((response) => {
        setReportDetails(response.data?.data);
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      width={550}
      title={<div style={{ textAlign: "center" }}>Daily Sales Report</div>}
      headerStyle={{ borderBottom: "none", paddingBlockStart: "2em" }}
    >
      {reportDetails && Object.keys(reportDetails).length > 0 ? (
        <div className={`${styles.report_details} ${styles.flex_col_2}`}>
          <div className={styles.space_between}>
            <div className={styles.flex_5}>
              <img
                src={reportDetails?.profile_pic_url || staffIcon}
                alt={reportDetails?.user_name}
                className={styles.profile_img}
              />
              <Tooltip placement="topLeft" title={reportDetails?.user_name}>
                <p
                  className={`${styles.bold_black} ${styles.text_overflow}`}
                  style={{ fontSize: 16 }}
                >
                  {reportDetails?.user_name}
                </p>
              </Tooltip>
            </div>
            <p style={{ fontWeight: 600, color: "#464646" }}>
              {moment(reportDetails?.date).format("DD MMM YYYY")}
            </p>
          </div>
          <SalesDetailsTable
            reportDetails={{
              ...reportDetails,
              params: {
                date: date
                  ? moment(date).format("DD-MM-YYYY")
                  : moment().format("DD-MM-YYYY"),
              },
            }}
          />
        </div>
      ) : (
        <div className={styles.no_data}>
          <img src={reportDetails ? noData : noHistoricData} alt="no-data" />
          <div>
            {reportDetails ? (
              "No Activities Performed"
            ) : (
              <>
                <p className={styles.bold_black}>No Data Available</p>
                Data in this "Daily sales Report" is not available for this date
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
