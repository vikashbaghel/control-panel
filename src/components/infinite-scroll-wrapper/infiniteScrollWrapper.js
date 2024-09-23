import axios from "axios";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Col } from "antd";

const constants = {
  isApiUrlChange: true,
};

export default function InfiniteScrollWrapper({
  children,
  apiUrl,
  formatter = (arr) => arr,
  height = 300,
  filterBy,
}) {
  const cookies = new Cookies();

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page) => {
    const headers = { Authorization: cookies.get("rupyzToken") };
    let params = { page_no: page };

    const res = await axios.get(apiUrl, { headers, params });
    let dataArr = formatter(res.data.data);

    if (
      dataArr?.length < 30 ||
      (filterBy === "selected" &&
        res.data?.headers?.next_params?.split("&")[0] === "selected=false")
    ) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    return dataArr;
  };

  useEffect(() => {
    setPageNo(-1);
    constants.isApiUrlChange = true;
  }, [apiUrl]);

  useEffect(() => {
    if (pageNo === -1) {
      constants.isApiUrlChange = false;
      setPageNo(1);
    } else if (!constants.isApiUrlChange) {
      fetchData(pageNo).then((newData) => {
        if (pageNo === 1) setData(newData);
        else setData(data.concat(newData));
      });
    }
  }, [pageNo]);

  return (
    <InfiniteScroll
      dataLength={data?.length}
      next={() => {
        const page = pageNo + 1 || 1;
        setPageNo(page);
      }}
      hasMore={hasMore}
      height={height}
      loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
      scrollableTarget="scrollableDiv"
    >
      <div
        id="scrollableDiv"
        style={{ display: "flex", flexDirection: "column", gap: "1em" }}
      >
        {data?.map((ele, index) => (
          <div key={data.id || index}>{children(ele, index)}</div>
        ))}
      </div>
      {!hasMore && !(data || []).length && (
        <Col align="middle">No record found</Col>
      )}
    </InfiniteScroll>
  );
}
