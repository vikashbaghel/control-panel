import moment from "moment";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import tcIcon from "../../../assets/beat/customer.svg";
import filterService from "../../../services/filter-service";
import pcIcon from "../../../assets/staffImages/orderIcon.svg";
import StaffAttendanceListDrawer from "./StaffAttendanceListDrawer";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import staffStatusIcon from "./../../../assets/activities/teamActivity/status.svg";
import { DatePickerInput } from "../../../components/form-elements/datePickerInput";
import { getAggregatedStatusCounts } from "../../../redux/action/recordFollowUpAction";
import { CalendarIcon } from "../../../assets/activities/teamActivity/calendarIcon";

export default function AggregatedCounts({ searchParams }) {
  const [statusCounts, setStatusCounts] = useState({});
  const [staffAttendanceListParams, setStaffAttendanceListParams] = useState(
    {}
  );

  const currentDate = moment().format("DD-MM-YYYY");

  const statusList = [
    {
      status: "ACTIVE",
      label: "Active",
      count: statusCounts?.active_staff_count,
      color: "#2DAD33",
    },
    {
      status: "LEAVE",
      label: "On leave",
      count: statusCounts?.leave_staff_count,
      color: "#E10000",
    },
    {
      status: "INACTIVE",
      label: "Inactive",
      count: statusCounts?.inactive_staff_count,
      color: "#727176",
    },
  ];

  const fetchStatusCounts = async () => {
    const date = moment(
      searchParams.status_date || currentDate,
      "DD-MM-YYYY"
    ).format("YYYY-MM-DD");

    setStatusCounts(
      (await getAggregatedStatusCounts({
        date,
      })) || {}
    );
  };

  useEffect(() => {
    fetchStatusCounts();
  }, [searchParams.status_date]);

  return (
    <div className={styles.flex} style={{ gap: "1em" }}>
      <div
        className={`${styles.gradient_background} ${styles.color_grey}`}
        style={{ flex: 1 }}
      >
        <div
          className={styles.space_between}
          style={{
            paddingInline: "1.5em",
            borderBottom: "1px solid #DDDDDD",
            height: 55,
          }}
        >
          <div className={styles.flex} style={{ fontWeight: 500 }}>
            <img src={staffStatusIcon} alt="status" />
            Staff Status
          </div>
          <div style={{ width: 135 }}>
            <DatePickerInput
              format="DD/MM/YYYY"
              value={searchParams?.status_date || currentDate}
              onChange={(v) => {
                filterService.setFilters({ status_date: v });
              }}
              params={{
                className: "custom-picker-bg-grey",
                allowClear: false,
                inputReadOnly: true,
                disabledDate: (current) =>
                  current && current > moment().endOf("day"),
                suffixIcon: <CalendarIcon />,
              }}
            />
          </div>
        </div>
        <div
          className={styles.space_between}
          style={{ padding: "1em 1.5em", fontWeight: 500 }}
        >
          {statusList.map((ele) => (
            <p className={styles.flex}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "100%",
                  backgroundColor: ele.color,
                }}
              />
              {ele.label}
              <span
                className={styles.flex}
                style={{
                  color: ele.color,
                  fontSize: 16,
                  ...(ele.count && {
                    textDecoration: "underline",
                    cursor: "pointer",
                  }),
                }}
                onClick={() => {
                  if (ele.count) {
                    setStaffAttendanceListParams(ele);
                  }
                }}
              >
                {ele.count || 0}
                <RightOutlined
                  style={{
                    color: "#727176",
                    ...(!ele.count && { opacity: 0.5 }),
                  }}
                />
              </span>
            </p>
          ))}
        </div>
      </div>
      <div className={`${styles.gradient_background} ${styles.color_grey}`}>
        <div
          className={styles.flex}
          style={{
            paddingInline: "1.5em",
            borderBottom: "1px solid #DDDDDD",
            height: 55,
            fontWeight: 500,
          }}
        >
          <img src={tcIcon} alt="tc" />
          TC (Meetings)
        </div>
        <div
          style={{
            padding: "1.055em 1.5em",
            fontSize: 22,
            fontWeight: 600,
            color: "#312B81",
            textAlign: "center",
          }}
        >
          {statusCounts?.tc_meeting_count || 0}
        </div>
      </div>

      <div className={`${styles.gradient_background} ${styles.color_grey}`}>
        <div
          className={styles.flex}
          style={{
            paddingInline: "1.93em",
            borderBottom: "1px solid #DDDDDD",
            height: 55,
            fontWeight: 500,
          }}
        >
          <img src={pcIcon} alt="pc" style={{ opacity: 0.6 }} />
          PC (Orders)
        </div>
        <div
          style={{
            padding:
              statusCounts?.pc_order_count && statusCounts?.total_order_amount
                ? ".5em 1.5em"
                : "1.055em 1.5em",
            fontSize: 22,
            fontWeight: 600,
            color: "#312B81",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {statusCounts?.pc_order_count && statusCounts?.total_order_amount ? (
            <>
              {statusCounts?.pc_order_count}
              <span style={{ color: "#000000", fontSize: 16 }}>
                {toIndianCurrency(statusCounts?.total_order_amount)}
              </span>
            </>
          ) : (
            statusCounts?.pc_order_count
          )}
        </div>
      </div>
      <StaffAttendanceListDrawer
        {...{
          searchParams,
          staffAttendanceListParams,
          setStaffAttendanceListParams,
        }}
      />
    </div>
  );
}
