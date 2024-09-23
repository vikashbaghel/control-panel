import axios from "axios";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { BASE_URL_V2, org_id } from "../../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import { Staff as staffIcon } from "../../../assets/navbarImages";

export default function AssignedStaffList() {
  const cookies = new Cookies();

  const queryParameters = new URLSearchParams(window.location.search);
  const beat_id = queryParameters.get("id") || 0;

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page, search) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${beat_id}/mapping/staff/?get_selected_only=true`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, name: search };
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

  useEffect(() => {
    if (pageNo > 1) {
      fetchData(pageNo).then((newData) => setData(data.concat(newData)));
    } else {
      setData([]);
      setHasMore(true);
      setPageNo(1);
      fetchData(pageNo).then((newData) => setData(newData));
    }
  }, [pageNo]);

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={handleLoadMore}
      hasMore={hasMore}
      height="auto"
      loader={
        hasMore === true ? (
          <h4 style={{ textAlign: "center" }}>Loading...</h4>
        ) : (
          <></>
        )
      }
      scrollableTarget="scrollableDiv"
      style={{ paddingBlockStart: "1em" }}
    >
      <div className={styles.col_1}>
        {data?.map((ele) => (
          <div key={ele?.id} className={styles.staff_detail_card}>
            <img
              src={ele?.profile_pic_url || staffIcon}
              alt="staff"
              className={styles.staff_img}
            />
            <div className={styles.col_1} style={{ gap: "0.5em" }}>
              <p className={styles.bold_black}>{ele?.name}</p>
              <p style={{ color: "#0886D2" }}>{ele?.roles[0]}</p>
              <p style={{ color: "#777777" }}>ID : {ele?.employee_id}</p>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
