import React from "react";
import styles from "./notification.module.css";
import Cookies from "universal-cookie";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL_V1, org_id } from "../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import { Date } from "../notification/index";
import {
  getNotification,
  updateNotification,
} from "../../redux/action/pushNotification";
import { useDispatch } from "react-redux";
import { Divider } from "antd";

const NotificationModal = () => {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [pageNo, setPageNo] = useState(1);
  const [modalData, setModalData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    const url = `${BASE_URL_V1}/notification/fcm/?page_no=${pageNo}&org_id=${org_id}`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setModalData(modalData.concat(response.data.data.results));
      // onChange();
      setPageNo(pageNo + 1);
      if (response.data.data.results.length !== 30) {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    fetchMoreData();
    setPageNo(1);
    setModalData([]);
  }, []);

  const handleIsSeen = (id) => {
    dispatch(updateNotification(id));
    setTimeout(() => {
      dispatch(getNotification(1));
    }, 400);
    if (id !== undefined) {
      for (let index = 0; index < modalData.length; index++) {
        if (modalData[index].id === id) {
          Object.assign(modalData[index], {
            is_seen: true,
          });
        }
      }
      return;
    }
    for (let index = 0; index < modalData.length; index++) {
      setTimeout(() => {
        Object.assign(modalData[index], {
          is_seen: true,
        });
      }, 500);
    }
  };

  return (
    <div>
      {" "}
      <div onClick={() => handleIsSeen()} className={styles.modal_seen_all}>
        Mark Seen all
      </div>
      <Divider style={{ margin: " 0" }} />
      <InfiniteScroll
        dataLength={modalData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        height={600}
        loader={
          <h4 style={{ textAlign: "center", color: "blue" }}>Loading...</h4>
        }
        endMessage={
          <p style={{ textAlign: "center", color: "green" }}>
            <b>... that's all</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
        style={{ borderRadius: 5 }}
      >
        {modalData &&
          modalData.map((data, index) => {
            let isSeen = data.is_seen;
            return (
              <div
                key={index}
                className={styles.modal_notification_group}
                style={{
                  background: !isSeen ? "#F0F6FF" : "",
                  padding: 3,
                }}
              >
                <div
                  className="clickable"
                  onClick={() => {
                    handleIsSeen(data.id);
                  }}
                  id="scrollableDiv"
                >
                  <Date date={data.updated_at} />
                  <div className={styles.modal_header}>{data.title}</div>
                  <div className={styles.modal_description}>
                    {data.description}
                  </div>
                </div>
              </div>
            );
          })}
      </InfiniteScroll>
    </div>
  );
};

export default NotificationModal;
