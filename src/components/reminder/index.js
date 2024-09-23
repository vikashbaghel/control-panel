import React, { useEffect, useState } from "react";
import styles from "./reminder.module.css";
import { Calender, EmptyReminder } from "../../assets/navbarImages";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Select } from "antd";
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { customerDetails } from "../../redux/action/customerAction";
import CustomerIcon from "../../assets/distributor/customer-img.svg";
import { followUpReminderDetails } from "../../redux/action/reminder";
import GeoLocationFencing from "../geoFencing/geoLocationFencing";
import AttendanceModal from "../attendanceModal";
import WrapText from "../wrapText";
import DetailReminderModal from "./ReminderDetail";
import { singleLeadDataAction } from "../../redux/action/leadManagementAction";
import CheckOut from "../checkOut";
import { updateCheckInCustomer } from "../../services/checkIn-service";

const cookies = new Cookies();

const Reminder = ({ isOpen, count }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    followUpReminderDetailsReducer,
    deleteFollowUpReminderReducer,
    addFeedBackAndActivity,
  } = state;

  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //   const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TODAY");
  const [date, setDate] = useState("");

  // const [groupedByDate, setGroupedByDate] = useState({})

  const [selectedData, setSelectedData] = useState({});

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  //   for infinite loop API calling
  const fetchData = async (page_no, filter_by, date) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/reminder/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no, filter_by, date };

    const newDataTemp = await axios.get(url, { headers, params });
    count(newDataTemp.data.data.count);
    if (newDataTemp.data.data.results.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data.results;
  };

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  const handleSelect = (data) => {
    setDetailModalOpen(true);
    dispatch(followUpReminderDetails(data.id));
    if (data.module_type.split(" ")[0].toLowerCase() === "customer") {
      dispatch(customerDetails(data.module_id));
      return;
    }
    dispatch(singleLeadDataAction(data.module_id));
  };

  const callingTheReminderDetailsAPI = () => {
    fetchData(1, filter, date).then((newData) => setData(newData));
  };

  const onCalenderChange = (value) => {
    setDate(value.format("YYYY-MM-DD"));
    setPageNo(1);
    setHasMore(true);
    setFilter("DATE");
    fetchData(1, "DATE", value.format("YYYY-MM-DD")).then((newData) =>
      setData(newData)
    );
    setTimeout(() => {
      setopenCalender(false);
    }, 200);
  };

  const [openCalender, setopenCalender] = useState(false);

  const groupedByDate = data.reduce((acc, item) => {
    const date = item.due_datetime.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  useEffect(() => {
    !detailModalOpen && setSelectedData({});
  }, [detailModalOpen]);

  useEffect(() => {
    if (isOpen) {
      updateCheckInCustomer();
    } else {
      setopenCalender(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      followUpReminderDetailsReducer.data &&
      !followUpReminderDetailsReducer.data.data.error
    ) {
      setSelectedData(followUpReminderDetailsReducer.data.data.data);
    }
    if (
      (deleteFollowUpReminderReducer.data &&
        !deleteFollowUpReminderReducer.data.data.error) ||
      (addFeedBackAndActivity.data && !addFeedBackAndActivity.data.data.error)
    ) {
      setDetailModalOpen(false);
      setPageNo(1);
      setHasMore(true);
      callingTheReminderDetailsAPI();
    }
  }, [state]);

  useEffect(() => {
    fetchData(pageNo, filter, date).then((newData) =>
      setData(data.concat(newData))
    );
  }, [pageNo]);

  let currentDate = new Date();
  currentDate = moment(currentDate).format("YYYY-MM-DD");

  return (
    <div
      className={`${styles.reminder_container} ${isOpen ? styles.isOpen : ""}`}
    >
      <div className={styles.header}>
        Reminders
        <span>
          <img
            src={Calender}
            alt="calender"
            onClick={() => setopenCalender(!openCalender)}
          />
          <div
            className={styles.calender_list}
            style={{ display: openCalender ? "" : "none" }}
          >
            <Calendar
              fullscreen={false}
              onChange={onCalenderChange}
              key={`render-${filter}`}
            />
          </div>
        </span>
      </div>
      <div
        className={styles.filter_conatiner}
        onClick={() => setopenCalender(false)}
      >
        <Filter
          selectedOption={(option) => {
            if (!option) return;
            setPageNo(1);
            setHasMore(true);
            setFilter(option);
            setDate("");
            fetchData(1, option, option === "DATE" ? currentDate : date).then(
              (newData) => setData(newData)
            );
          }}
          value={filter}
          date={date || currentDate}
        />
      </div>

      {data.length === 0 ? (
        <>
          {" "}
          <img src={EmptyReminder} alt="reminder" style={{ width: "100%" }} />
          <p className={styles.empty_comment}>You dont have any Reminders</p>
        </>
      ) : (
        <>
          <InfiniteScroll
            dataLength={data.length}
            next={handleLoadMore}
            hasMore={hasMore}
            height={300}
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
            {Object.keys(groupedByDate).map((ele, ind) => {
              return (
                <div id="scrollableDiv" key={ind}>
                  <div key={ind}>
                    <div className={styles.header_date}>
                      {moment(ele).format("ddd, DD MMM")}
                    </div>
                    {groupedByDate[ele].map((item, index) => {
                      return (
                        <div
                          className={styles.card}
                          onClick={() => handleSelect(item)}
                        >
                          <div>
                            <img
                              src={item.logo_image_url || CustomerIcon}
                              alt="icon"
                            />
                            <div>
                              <div className={styles.card_head}>
                                <WrapText len={25}>
                                  {item.business_name}
                                </WrapText>
                              </div>
                              <div className={styles.card_sub_head}>
                                {item.module_type.split(" ")[0]} -{" "}
                                {item.feedback_type}
                              </div>
                              <div className={styles.card_time}>
                                {formatTime(item.due_datetime)}
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.card_message}
                            style={{ display: item.comments ? "" : "none" }}
                          >
                            {item.comments}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </>
      )}
      {Object.keys(selectedData || {}).length > 0 && (
        <DetailReminderModal
          key={`open-${detailModalOpen}`}
          isOpen={detailModalOpen}
          isClose={(option) => setDetailModalOpen(option)}
          data={selectedData}
        />
      )}
      <GeoLocationFencing />
      <CheckOut />
      <AttendanceModal />
    </div>
  );
};

export default Reminder;

const Filter = ({ selectedOption, value, date }) => {
  return (
    <div>
      <Select
        placeholder="Select..."
        onChange={(event) => selectedOption(event)}
        value={value}
        options={[
          { value: "TODAY", label: "Today" },
          { value: "TOMORROW", label: "Tomorrow" },
          { value: "WEEK", label: "This Week" },
          { value: "MONTH", label: "This Month" },
          { value: "PREVIOUS", label: "Previous" },
          { value: "DATE", label: "Date" },
        ]}
        style={{ width: 200, height: 35 }}
        {...(value === "DATE"
          ? {
              allowClear: true,
              labelRender: (v) => moment(date).format("DD MMM YYYY"),
              onClear: () => {
                selectedOption("TODAY");
              },
            }
          : {})}
      ></Select>
    </div>
  );
};

export const formatTime = (time) => {
  return moment(time).format("hh:mm a");
};
