import axios from "axios";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import Context from "../../../context/Context";
import { useSearchParams } from "react-router-dom";
import { BASE_URL_V2, org_id } from "../../../config";
import SearchInput from "../../search-bar/searchInput";
import { useContext, useEffect, useState } from "react";
import handleParams from "../../../helpers/handleParams";
import InfiniteScroll from "react-infinite-scroll-component";
import noDataIcon from "../../../assets/beat/no-customer-data.svg";
import CustomerFilters from "../distributor-details/customerFilters";
import noSearchResultIcon from "../../../assets/globle/no-results.svg";
import CustomerDetailCard from "../distributor-details/customerDetailCard";
import CheckInCustomer from "../../../views/distributor/checkIn";

export default function CustomersList({ beat_id, isDrawerOpen, onClose }) {
  const cookies = new Cookies();

  const [searchParams, setSearchParams] = useSearchParams();
  const state = useSelector((state) => state);

  const context = useContext(Context);
  const { setAddBeatOpen } = context;

  const initialFilters = {
    sort_by: "name",
    sort_order: "ASC",
    staff_id: 0,
    customer_type: "",
  };

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchValue, setSearchValue] = useState();
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = async (page, search, addFilters) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${beat_id}/mapping/?assigned_status=ASSIGNED&get_customer_details=true`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    let params = { page_no: page, name: search };
    if (addFilters) params = { ...params, ...filters };
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
    if (
      state.deleteCustomer.data !== "" &&
      !state.deleteCustomer.data.data.error &&
      !state?.deleteCustomer?.data?.params?.check_children
    ) {
      setData([]);
      setPageNo(1);
      setSearchValue();
      fetchData(pageNo, searchValue).then((newData) => setData(newData));
    }
  }, [state]);

  useEffect(() => {
    if (!isDrawerOpen) {
      setData([]);
      setPageNo(1);
      setSearchValue();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen && beat_id) {
      const { sort_by, sort_order, staff_id, customer_type } = filters;
      if (
        searchValue ||
        sort_by ||
        sort_order ||
        staff_id ||
        customer_type ||
        pageNo > 1
      ) {
        fetchData(pageNo, searchValue, true).then((newData) =>
          setData(data.concat(newData))
        );
      } else {
        setData([]);
        setHasMore(true);
        setPageNo(1);
        setSearchValue();
        fetchData(pageNo, searchValue).then((newData) => setData(newData));
      }
    }
  }, [pageNo, searchValue, filters, beat_id]);

  return (
    <div className={styles.col_1}>
      {!searchValue &&
      !filters?.customer_type &&
      filters?.staff_id === 0 &&
      !filters?.sort_by &&
      data.length === 0 ? (
        <div
          className={styles.col_1}
          style={{ alignItems: "center", paddingBlock: "3em" }}
        >
          <img src={noDataIcon} alt="no-customer" width={250} />
          <p style={{ color: "#727176" }}>No Customers Added</p>
          <div
            className="button_primary"
            onClick={() => {
              handleParams(searchParams, setSearchParams, {
                edit_id: beat_id,
              });
              setAddBeatOpen(true);
            }}
          >
            Add Customer
          </div>
        </div>
      ) : (
        <>
          <SearchInput
            defaultQuery={false}
            searchValue={(data) => {
              setData([]);
              setHasMore(true);
              setPageNo(1);
              setSearchValue(data);
            }}
          />
          <CustomerFilters
            selectedValue={(data) => {
              setData([]);
              setHasMore(true);
              setPageNo(1);
              setFilters({
                staff_id: data.staff_id || 0,
                customer_type: data.customerTypeList.join(","),
                ...(data.sortBy && {
                  sort_by: data.sortBy,
                  sort_order: data.sortOrder,
                }),
              });
            }}
          />
          <InfiniteScroll
            dataLength={data.length}
            next={handleLoadMore}
            hasMore={hasMore}
            height={700}
            loader={
              hasMore === true ? (
                <h4 style={{ textAlign: "center" }}>Loading...</h4>
              ) : (
                <></>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className={styles.col_1}>
              {data.length > 0 ? (
                data?.map((ele) => (
                  <CustomerDetailCard
                    key={ele?.id}
                    data={ele}
                    isCustomerClient={true}
                    fromBeat={true}
                    hideActionButton={true}
                  />
                ))
              ) : (
                <div style={{ textAlign: "center" }}>
                  <img src={noSearchResultIcon} alt="no-result" />
                  <p>No Customer found</p>
                </div>
              )}
            </div>
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
