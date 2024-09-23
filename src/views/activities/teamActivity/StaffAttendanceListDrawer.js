import moment from "moment";
import { Drawer } from "antd";
import { useState } from "react";
import styles from "./styles.module.css";
import WrapText from "../../../components/wrapText";
import { BASE_URL_V2, org_id } from "../../../config";
import { Staff as staffIcon } from "../../../assets/dashboardIcon";
import AttendanceDetailView from "../../../components/attendance/attendanceDetailView";
import InfiniteScrollWrapper from "../../../components/infinite-scroll-wrapper/infiniteScrollWrapper";

export default function StaffAttendanceListDrawer({
  searchParams,
  staffAttendanceListParams,
  setStaffAttendanceListParams,
}) {
  const [attendanceDetailOpen, setAttendanceDetailOpen] = useState({
    open: false,
    detail: {},
  });

  const date = searchParams?.status_date
    ? moment(searchParams.status_date, "DD-MM-YYYY").format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  return (
    <>
      <Drawer
        open={!!Object.keys(staffAttendanceListParams).length}
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div className={styles.flex} style={{ justifyContent: "center" }}>
              {staffAttendanceListParams.label} Staffs
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "100%",
                  backgroundColor: staffAttendanceListParams.color,
                }}
              />
            </div>
            <div className={styles.color_grey} style={{ fontSize: 14 }}>
              {moment(date).format("DD MMM YY")}
            </div>
          </div>
        }
        styles={{ header: { borderBottom: "none" } }}
        width={500}
        onClose={() => setStaffAttendanceListParams({})}
      >
        <div>
          <div
            className={styles.space_between}
            style={{ padding: "1em 2em", color: "#727176", fontWeight: 500 }}
          >
            <div>Staff Name</div>
            {staffAttendanceListParams.status === "ACTIVE" && (
              <div>Day Started</div>
            )}
            {staffAttendanceListParams.status === "LEAVE" && (
              <div>Marked Leave</div>
            )}
          </div>

          {!!Object.keys(staffAttendanceListParams).length && (
            <InfiniteScrollWrapper
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/activity/team/attendance/?date=${date}&status=${staffAttendanceListParams.status}`}
              height={"80vh"}
            >
              {(item, index) => (
                <div
                  className={`${styles.space_between} ${
                    staffAttendanceListParams.status === "LEAVE" &&
                    styles.gradient_background
                  }`}
                  style={
                    staffAttendanceListParams.status === "LEAVE"
                      ? {
                          padding: "18px",
                          width: "82%",
                          margin: "auto",
                          cursor: "pointer",
                        }
                      : {
                          padding: "0 2em 1em",
                          borderBottom: "1px solid #DDDDDD",
                          ...(index === 0 && {
                            borderTop: "1px solid #DDDDDD",
                            paddingBlock: "1em",
                          }),
                        }
                  }
                  onClick={() => {
                    if (staffAttendanceListParams.status === "LEAVE") {
                      setAttendanceDetailOpen({
                        open: true,
                        detail: {
                          action: "Check In",
                          module_id: item?.attendance_id,
                        },
                      });
                    }
                  }}
                >
                  <div className={styles.flex} style={{ fontWeight: 600 }}>
                    <img
                      src={item.pic_url || staffIcon}
                      alt={item.staff_name}
                      width={40}
                      height={40}
                      style={{ borderRadius: "100%" }}
                    />
                    <WrapText width={300}>{item.staff_name}</WrapText>
                  </div>
                  {(staffAttendanceListParams.status === "ACTIVE" ||
                    staffAttendanceListParams.status === "LEAVE") && (
                    <div style={{ color: "#727176", fontWeight: 500 }}>
                      {moment(item.time_in).format("hh:mm A")}
                    </div>
                  )}
                </div>
              )}
            </InfiniteScrollWrapper>
          )}
        </div>
      </Drawer>
      <AttendanceDetailView
        {...{ attendanceDetailOpen, setAttendanceDetailOpen }}
      />
    </>
  );
}
