import moment from "moment";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateFilterWithButtons } from "./Filters";
import {
  getActivityMapLogs,
  getDSRDetails,
} from "../../../redux/action/recordFollowUpAction";
import { ArrowLeft } from "../../../assets/globle";
import Person from "../../../assets/map-person.png";
import DeviceDetailsDrawer from "./DeviceDetailsDrawer";
import AdminLayout from "../../../components/AdminLayout";
import StartPoint from "../../../assets/map-start-point.png";
import filterService from "../../../services/filter-service";
import { Staff as staffIcon } from "../../../assets/dashboardIcon";
import { FakeLocationInfoPopup } from "./StaffActivityDetailsTable";
import { getLiveLocation } from "../../../redux/action/liveLocation";
import orderIcon from "../../../assets/activities/activity-order.svg";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import endDayIcon from "../../../assets/activities/activity-day-end.svg";
import ActivityCard from "../../../components/activity-card/activityCard";
import startDayIcon from "../../../assets/activities/activity-day-start.svg";
import lastActiveIcon from "../../../assets/activities/live-location-map.svg";
import defaultActivityIcon from "../../../assets/activities/activity-default.svg";
import newCustomerIcon from "../../../assets/activities/activity-new-customer.svg";
import deviceLogsIcon from "../../../assets/activities/teamActivity/device-logs.svg";
import AttendanceDetailView from "../../../components/attendance/attendanceDetailView";
import activityMapIcon from "../../../assets/activities/teamActivity/activity-map.svg";
import noActivityIcon from "../../../assets/activities/teamActivity/no-map-activity.svg";
import liveLocationIcon from "../../../assets/activities/teamActivity/live-location.svg";
import Directions from "../../../components/activity-details-header/googleMapModal/directions";
import { createCoordinatesForMap } from "../../../components/activity-details-header/activityHeader";
import SalesDetailsTable from "../../../components/viewDrawer/sales-report-details/salesDetailsTable";
import LoaderInPage from "../../../components/loader/LoaderInPage";

export default function StaffActivityDetails() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [hoveredMarker, setHoveredMarker] = useState();
  const [popupFadeTimer, setPopupFadeTimer] = useState(null);
  const [toggleLocationPopup, setToggleLocationPopup] = useState(false);
  const [activityReportDetails, setActivityReportDetails] = useState({});
  const [showLiveLocationTab, setShowLiveLocationTab] = useState(false);
  const [toggleLastActive, setToggleLastActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const [mapCoordinates, setMapCoordinates] = useState({
    activity: [],
    liveLocation: [],
    last_active_point: {},
  });
  const [searchParams, setSearchParams] = useState({
    ...filterService.getFilters(),
  });
  const [activeTabs, setActiveTabs] = useState({
    activity: true,
    liveLocation: false,
    deviceLogs: false,
  });
  const [attendanceDetailOpen, setAttendanceDetailOpen] = useState({
    open: false,
    detail: {},
  });

  const user_id = searchParams?.user_id;
  const date = moment(searchParams?.date, "DD-MM-YYYY").format("YYYY-MM-DD");
  const staffHierarchyDisable =
    cookies.get("rupyzAccessType") !== "WEB_SARE360" &&
    !cookies.get("rupyzLoginData")?.hierarchy;

  const tabOptions = staffHierarchyDisable
    ? []
    : [
        {
          key: "deviceLogs",
          label: "Device Log",
          icon: deviceLogsIcon,
        },
        ...(showLiveLocationTab
          ? [
              {
                key: "liveLocation",
                label: "Live Location",
                icon: liveLocationIcon,
              },
            ]
          : []),

        ...(mapCoordinates.activity.length || showLiveLocationTab
          ? [
              {
                key: "activity",
                label: "Activity Points",
                icon: activityMapIcon,
              },
            ]
          : []),
      ];

  const fetchActivityIcon = (item) => {
    switch (item.module_type.toLowerCase()) {
      case "attendance":
        return item.action === "Check In" ? startDayIcon : endDayIcon;
      case "order":
      case "payment":
        return orderIcon;
      case "customer":
      case "lead":
        return newCustomerIcon;
      default:
        return defaultActivityIcon;
    }
  };

  const fetchActivityDetails = async () => {
    setLoading(true);
    const dsrDetailsOfStaff =
      (await getDSRDetails({
        user_id,
        date,
      })) || {};

    setActivityReportDetails(dsrDetailsOfStaff);
    if (!Object.keys(dsrDetailsOfStaff).length) {
      setMapCoordinates({
        activity: [],
        liveLocation: [],
        last_active_point: {},
      });
      setLoading(false);
      return;
    }
    fetchMapCoordinates("activity");
  };

  const fetchMapCoordinates = async (type) => {
    setLoading(true);
    let last_active_point = {},
      liveLocationPoints = [],
      activityCoordinates = [];

    if (type === "activity") {
      const activityPoints =
        (await getActivityMapLogs({ user_id, date })) || {};
      activityCoordinates = createCoordinatesForMap(
        activityPoints?.activity_list?.reverse() || [],
        "geo_location_lat",
        "geo_location_long"
      );
      setShowLiveLocationTab(
        activityPoints?.activity_modules?.is_live_location_system_used
      );
      last_active_point =
        activityPoints?.activity_modules?.is_live_location_system_used &&
        moment().format("DD-MM-YYYY") === searchParams.date &&
        moment().isBefore(moment().hour(20))
          ? {
              lat:
                activityPoints?.activity_modules?.last_live_location?.lat || "",
              lng:
                activityPoints?.activity_modules?.last_live_location?.long ||
                "",
            }
          : {};
    } else {
      liveLocationPoints = await getLiveLocation(user_id, date);
      liveLocationPoints = createCoordinatesForMap(
        liveLocationPoints?.data,
        "geo_lat",
        "geo_long"
      );
    }
    setMapCoordinates({
      activity: activityCoordinates || [],
      liveLocation: liveLocationPoints || [],
      last_active_point,
    });
    setLoading(false);
  };

  const handleActivityPopup = (index) => {
    if (index >= 0) {
      setHoveredMarker(index);
      clearTimeout(popupFadeTimer);
      return;
    }
    if (popupFadeTimer) {
      clearTimeout(popupFadeTimer);
    }
    const delayInClose = setTimeout(() => {
      setHoveredMarker(null);
    }, 1000);
    setPopupFadeTimer(delayInClose);
  };

  useEffect(() => {
    fetchActivityDetails();
  }, [searchParams?.date]);

  useEffect(() => {
    filterService.setEventListener(setSearchParams);
  }, []);

  return (
    <AdminLayout
      leftPanel={
        <div className={styles.flex} style={{ gap: "1em", flex: 1 }}>
          <img
            src={ArrowLeft}
            alt="back"
            onClick={() => {
              navigate(-1);
            }}
            style={{ cursor: "pointer" }}
          />
          <div className={styles.flex}>
            <img
              src={searchParams?.pic_url || staffIcon}
              alt="profile"
              className={styles.img_container_rounded}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 600,
              }}
            >
              <p style={{ margin: 0, fontSize: 22 }}>
                {searchParams?.user_name}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#000000" }}>
                Map View -{" "}
                <span style={{ color: "#727176" }}>
                  {moment(searchParams?.date, "DD-MM-YYYY").format(
                    "DD MMM YYYY"
                  )}
                </span>
              </p>
            </div>
          </div>
          {/* {activityReportDetails?.is_fake_location_detected && (
            <div
              className={styles.fake_location_tag}
              onClick={() => setToggleLocationPopup(true)}
            >
              Fake location detected
            </div>
          )} */}
        </div>
      }
      panel={tabOptions.map((ele) => (
        <div
          className={`${styles.filter_button} ${
            activeTabs[ele.key] && "theme-fill"
          }`}
          style={
            activeTabs[ele.key]
              ? {
                  color: "#322E80",
                  fontWeight: 500,
                }
              : {}
          }
          onClick={() => {
            if (activeTabs.activity && ele.key === "liveLocation") {
              fetchMapCoordinates("live");
              setActiveTabs({
                activity: false,
                deviceLogs: false,
                liveLocation: true,
              });
            } else if (activeTabs.liveLocation && ele.key === "activity") {
              fetchMapCoordinates("activity");
              setActiveTabs({
                activity: true,
                deviceLogs: false,
                liveLocation: false,
              });
            } else if (ele.key === "deviceLogs") {
              setActiveTabs({
                ...activeTabs,
                deviceLogs: true,
              });
            }
          }}
        >
          <img src={ele.icon} alt={ele.key} />
          {ele.label}
        </div>
      ))}
    >
      <div className={styles.dsr_detail_container}>
        <div style={{ width: 450, border: "2px solid #FFFFFF" }}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              paddingBlock: ".5em",
            }}
          >
            <DateFilterWithButtons
              value={searchParams?.date}
              onChange={(v) => filterService.setFilters({ ...v, page: "" })}
              background="transparent"
              border={false}
            />
          </div>
          {!!Object.keys(activityReportDetails).length ? (
            <div
              style={{
                background:
                  "linear-gradient(107.41deg, rgba(238, 238, 238, 0.7) 0%, rgba(238, 238, 238, 0.4) 100%)",
              }}
            >
              <div
                style={{
                  padding: activityReportDetails?.checkin_time ? "1em" : 0,
                }}
                className={styles.flex}
              >
                {activityReportDetails?.attendance_type === "MARK_LEAVE" ? (
                  <div
                    className={styles.attendance_info_container}
                    style={{ color: "#E10000", padding: "1em" }}
                    onClick={() => {
                      setAttendanceDetailOpen({
                        open: true,
                        detail: {
                          ...activityReportDetails,
                          action: "Check In",
                          module_id: activityReportDetails?.attendance_id,
                        },
                      });
                    }}
                  >
                    On Leave
                  </div>
                ) : (
                  <>
                    {activityReportDetails?.checkin_time && (
                      <div
                        className={styles.attendance_info_container}
                        onClick={() => {
                          setAttendanceDetailOpen({
                            open: true,
                            detail: {
                              ...activityReportDetails,
                              action: "Check In",
                              module_id: activityReportDetails?.attendance_id,
                            },
                          });
                        }}
                      >
                        <div>
                          <span className={styles.color_grey}>
                            Day Started:{" "}
                          </span>
                          <span style={{ color: "#2DAD33" }}>
                            {moment(activityReportDetails?.checkin_time).format(
                              "hh:mm A"
                            )}
                          </span>
                        </div>
                        <div style={{ textTransform: "capitalize" }}>
                          {activityReportDetails?.activity_type
                            ?.toLowerCase()
                            ?.replace("_", " ")}
                        </div>
                      </div>
                    )}
                    {activityReportDetails?.checkout_time && (
                      <div
                        className={styles.attendance_info_container}
                        onClick={() => {
                          setAttendanceDetailOpen({
                            open: true,
                            detail: {
                              ...activityReportDetails,
                              action: "Check Out",
                              module_id: activityReportDetails?.attendance_id,
                            },
                          });
                        }}
                      >
                        <div>
                          <span className={styles.color_grey}>Day Ended: </span>
                          <span style={{ color: "#E10000" }}>
                            {moment(
                              activityReportDetails?.checkout_time
                            ).format("hh:mm A")}
                          </span>
                        </div>
                        <div style={{ textTransform: "capitalize" }}>
                          {activityReportDetails?.attendance_type
                            ?.toLowerCase()
                            ?.replace("_", " ")}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <SalesDetailsTable
                reportDetails={{
                  ...activityReportDetails,
                  params: { date: searchParams?.date },
                }}
                customStyles={{
                  table_container: {
                    border: "none",
                    borderRadius: 0,
                    background: "transparent",
                  },
                }}
              />
            </div>
          ) : (
            <div
              style={{
                height: "60vh",
                textAlign: "center",
                placeContent: "center",
              }}
            >
              <img src={noActivityIcon} alt="no-activity" />
              <div style={{ fontWeight: 600, color: "#727176" }}>
                No Activity Performed
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <LoaderInPage />
          ) : mapCoordinates?.activity?.length ||
            mapCoordinates?.liveLocation?.length ? (
            <>
              <GoogleMap
                onCenterChanged={() =>
                  toggleLastActive && setToggleLastActive(false)
                }
                mapContainerStyle={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
                center={
                  toggleLastActive
                    ? mapCoordinates?.last_active_point
                    : activeTabs?.activity
                    ? mapCoordinates?.activity[
                        mapCoordinates?.activity?.length - 1
                      ]
                    : activeTabs?.liveLocation
                    ? mapCoordinates?.liveLocation[
                        mapCoordinates?.liveLocation?.length - 1
                      ]
                    : ""
                }
                zoom={10}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {activeTabs.activity && !!mapCoordinates?.activity?.length && (
                  <>
                    {mapCoordinates?.activity?.map((stop, index) => (
                      <Marker
                        key={index}
                        position={stop}
                        onRedDraw={false}
                        label={{
                          text: `${index + 1}`,
                          color: "#fff",
                          className: "map-marker-label-text",
                        }}
                        icon={fetchActivityIcon(stop.activity_info)}
                        onMouseOver={() => {
                          handleActivityPopup(index);
                        }}
                        onMouseOut={handleActivityPopup}
                        zIndex={index + 1}
                      >
                        {hoveredMarker === index && (
                          <InfoWindow position={stop}>
                            <div
                              className={styles.map_activity_popup}
                              onMouseEnter={() => {
                                handleActivityPopup(index);
                              }}
                              onMouseLeave={handleActivityPopup}
                            >
                              <ActivityCard
                                size="small"
                                data={stop.activity_info}
                                showCustomerDetail={true}
                              />
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))}
                    {mapCoordinates?.activity?.length > 1 && (
                      <Directions data={mapCoordinates.activity} />
                    )}
                    {mapCoordinates?.last_active_point?.lat &&
                      mapCoordinates?.last_active_point?.lng && (
                        <Marker
                          position={mapCoordinates.last_active_point}
                          onRedDraw={false}
                          icon={{
                            url: lastActiveIcon,
                          }}
                          title="Current"
                          zIndex={99999}
                        />
                      )}
                  </>
                )}
                {activeTabs.liveLocation &&
                  !!mapCoordinates?.liveLocation?.length && (
                    <>
                      <Marker
                        position={mapCoordinates.liveLocation[0]}
                        onRedDraw={false}
                        icon={{
                          url: StartPoint,
                        }}
                        title="Start Point"
                      />
                      {mapCoordinates.liveLocation.length > 1 && (
                        <Marker
                          position={
                            mapCoordinates.liveLocation[
                              mapCoordinates.liveLocation.length - 1
                            ]
                          }
                          onRedDraw={false}
                          icon={{
                            url: Person,
                          }}
                          title="Current"
                        />
                      )}
                      {mapCoordinates.liveLocation.length > 1 && (
                        <Directions data={mapCoordinates.liveLocation} />
                      )}
                    </>
                  )}
              </GoogleMap>
              {mapCoordinates?.last_active_point?.lat &&
                mapCoordinates?.last_active_point?.lng && (
                  <div
                    className={styles.map_current_location_btn}
                    onClick={() => setToggleLastActive(true)}
                  >
                    <img src={lastActiveIcon} alt="current" width={40} />
                  </div>
                )}
            </>
          ) : (
            !!Object.keys(activityReportDetails)?.length && (
              <div style={{ textAlign: "center" }}>
                <img src={noActivityIcon} alt="no-activity" />
                <div style={{ fontWeight: 600, color: "#727176" }}>
                  No Activity Performed
                </div>
              </div>
            )
          )}
        </div>
        <AttendanceDetailView
          {...{ attendanceDetailOpen, setAttendanceDetailOpen }}
        />
        <FakeLocationInfoPopup
          {...{ toggleLocationPopup, setToggleLocationPopup }}
        />
      </div>
      <DeviceDetailsDrawer
        open={activeTabs.deviceLogs}
        onClose={() => setActiveTabs({ ...activeTabs, deviceLogs: false })}
        searchParams={searchParams}
      />
    </AdminLayout>
  );
}
