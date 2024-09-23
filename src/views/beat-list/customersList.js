import axios from "axios";
import Cookies from "universal-cookie";
import styles from "./beat.module.css";
import { Checkbox, Tooltip } from "antd";
import { useEffect, useState } from "react";
import mapPin from "../../assets/map-pin.svg";
import { BASE_URL_V2, org_id } from "../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import LoaderInPage from "../../components/loader/LoaderInPage";
import noDataIcon from "../../assets/beat/no-customer-data.svg";
import SearchInput from "../../components/search-bar/searchInput";
import noSearchResultIcon from "../../assets/globle/no-results.svg";
import customerIcon from "../../assets/distributor/customer-img.svg";
import CustomerFilters from "../../components/viewDrawer/distributor-details/customerFilters";

export default function CustomersList(props) {
  const { formValues, setFormValues, setValues, removeMappedCustomers } = props;

  const cookies = new Cookies();

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  //state for search
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //   state for checkList
  const [add, setAdd] = useState(formValues?.select_customer?.add_set || []);
  const [remove, setRemove] = useState(
    formValues?.select_customer?.remove_set || []
  );
  const [selectAll, setSelectAll] = useState(
    formValues?.select_customer?.allow_all
  );
  const [disAllowAll, setDisAllowAll] = useState(
    formValues?.select_customer?.disallow_all
  );

  // for loading
  const [loader, setLoader] = useState(false);

  const initialFilters = {
    sort_by: "",
    sort_order: "",
    staff_id: "",
    customer_type: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  const tabOptions = [
    {
      label: "All",
      value: "ALL",
    },

    { label: "Assigned", value: "ASSIGNED" },
    { label: "Not Assigned", value: "NOT_ASSIGNED" },
  ];

  //state for tab selection
  const [selectedTab, setselectedTab] = useState(tabOptions[0].value);

  const bannerColor = (level) => {
    if (level === "LEVEL-1") return "#FDE3C9";
    else if (level === "LEVEL-2") return "#DFF3CE";
    else return "#D1F2FB";
  };
  useEffect(() => {
    setSelectAll(formValues?.select_customer?.allow_all);
  }, [formValues?.select_customer?.allow_all]);

  //   for infinite loop API calling
  const fetchData = async (page, search, addFilters) => {
    let url;
    if (formValues?.parent_customer) {
      url = `${BASE_URL_V2}/organization/${org_id}/beat/${
        removeMappedCustomers ? 0 : formValues?.id || 0
      }/mapping/?customer_parent_id=${
        formValues?.parent_customer
      }&get_customer_details=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/beat/${
        removeMappedCustomers ? 0 : formValues?.id || 0
      }/mapping/?get_customer_details=true`;
    }

    const headers = { Authorization: cookies.get("rupyzToken") };

    let params = { page_no: page, name: search, assigned_status: selectedTab };

    if (addFilters) {
      if (!filters?.sort_by || !filters?.sort_order) {
        const filtersCopy = filters;
        delete filtersCopy?.sort_by;
        delete filtersCopy?.sort_order;
        params = { ...params, ...filtersCopy };
      } else params = { ...params, ...filters };
    }

    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  useEffect(() => {
    if (
      searchValue ||
      filters.customer_type ||
      filters.sort_by ||
      filters.sort_order ||
      filters.staff_id ||
      pageNo > 1
    ) {
      fetchData(pageNo, searchValue, true).then((newData) => {
        setData(data.concat(newData));
        setLoader(false);
      });
    } else {
      setPageNo(1);
      fetchData(pageNo, "").then((newData) => {
        setData(newData);
        setLoader(false);
      });
    }
  }, [selectedTab, pageNo, searchValue, filters]);

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  // to add or remove from the list
  const handleCheckedList = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      if (remove.includes(id)) {
        const filteredList = remove.filter((ele) => ele !== id);
        setRemove(filteredList);
      } else setAdd((prev) => prev.concat(id));
    } else {
      if (add.includes(id)) {
        const filteredList = add.filter((ele) => ele !== id);
        setAdd(filteredList);
      } else setRemove((prev) => prev.concat(id));
    }
  };

  //   to handle select all
  const handleSelectAllList = (e) => {
    e.preventDefault();
    setAdd([]);
    setRemove([]);
    if (e.target.checked) {
      setSelectAll(true);
      setDisAllowAll(false);
      setFormValues({
        ...formValues,
        allow_all_initial: false,
        total_selectall_count: data.length < 30 ? data.length : 31,
      });
    } else {
      setSelectAll(false);
      setDisAllowAll(true);
      setFormValues({
        ...formValues,
        allow_all_initial: false,
        total_selectall_count: 0,
      });
    }
  };

  useEffect(() => {
    if (formValues?.allow_all_initial && remove.length > 0) {
      setFormValues({
        ...formValues,
        allow_all_initial: false,
        total_selectall_count: data.length < 30 ? data.length : 31,
      });
    }
    setValues({
      add_set: add,
      remove_set: remove,
      allow_all: selectAll,
      disallow_all: disAllowAll,
    });
  }, [add, remove, selectAll, disAllowAll]);

  return (
    <>
      {formValues?.id > 0 && (
        <div className={styles.tab_selection}>
          {tabOptions.map((ele) => (
            <p
              key={ele.value}
              style={{
                borderBottom:
                  selectedTab === ele.value ? "4px solid #322E80" : "",
                color:
                  selectedTab === ele.value
                    ? "#322E80"
                    : formValues?.total_selectall_count
                    ? "#727176"
                    : "",
                cursor: formValues?.total_selectall_count ? "not-allowed" : "",
              }}
              onClick={() => {
                if (!formValues?.total_selectall_count) {
                  setLoader(true);
                  setPageNo(1);
                  setData([]);
                  setSearchValue();
                  setselectedTab(ele.value);
                }
              }}
            >
              {ele.label}
            </p>
          ))}
        </div>
      )}
      {loader ? (
        <div
          style={{
            display: "flex",
            height: "400px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoaderInPage />
        </div>
      ) : !searchValue &&
        !filters?.customer_type &&
        !filters?.staff_id &&
        !filters?.sort_by &&
        data.length === 0 ? (
        <div style={{ textAlign: "center", paddingBlock: "2em" }}>
          <img src={noDataIcon} alt="no-data" />
          <p style={{ color: "#727176" }}>No Customers to show</p>
        </div>
      ) : (
        <div className={styles.add_customers_page}>
          <SearchInput
            defaultQuery={false}
            searchValue={(data) => {
              setTimeout(() => {
                setData([]);
                setHasMore(true);
                setPageNo(1);
                setSearchValue(data);
              }, 500);
            }}
          />
          <CustomerFilters
            selectedValue={(data) => {
              setFilters({
                sort_by: data.sortBy,
                sort_order: data.sortOrder,
                staff_id: data.staff_id,
                customer_type: data.customerTypeList.join(","),
              });
              setData([]);
              setHasMore(true);
              setPageNo(1);
            }}
          />
          {data.length > 0 && selectedTab === "ALL" && (
            <Checkbox
              style={{ alignSelf: "flex-start" }}
              checked={selectAll && remove.length === 0}
              onChange={(e) => {
                handleSelectAllList(e);
              }}
            >
              &nbsp;&nbsp;
              {selectAll && remove.length === 0 ? "Remove All" : "Select All"}
            </Checkbox>
          )}

          <InfiniteScroll
            dataLength={data.length}
            next={handleLoadMore}
            hasMore={hasMore}
            height={350}
            loader={
              hasMore === true ? (
                <h4 style={{ textAlign: "center" }}>Loading...</h4>
              ) : (
                <></>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className={styles.cards}>
              {data.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <div
                      className={styles.assign_list_box}
                      id="scrollableDiv"
                      key={item.id}
                    >
                      <Checkbox
                        style={{ paddingLeft: "2px" }}
                        checked={
                          disAllowAll
                            ? add.includes(item.id)
                            : selectAll
                            ? !remove.includes(item.id)
                            : (item.is_selected && !remove.includes(item.id)) ||
                              add.includes(item.id)
                        }
                        onChange={(e) => {
                          handleCheckedList(e, item.id);

                          let arr = [...data];
                          arr[index]["is_selected"] = e.target.checked;
                          setData(arr);
                        }}
                      />
                      <div className={styles.customer_card}>
                        <div
                          className={styles.side_banner}
                          style={{
                            backgroundColor: bannerColor(item?.customer_level),
                          }}
                        >
                          {customerLevelList[item.customer_level].length > 11
                            ? customerLevelList[item.customer_level].slice(
                                0,
                                11
                              ) + "..."
                            : customerLevelList[item.customer_level]}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <div className={styles.customer_info}>
                            <img
                              src={item?.logo_image_url || customerIcon}
                              alt="customer"
                              width={70}
                              height={70}
                            />
                            <div className={styles.customer_details}>
                              <Tooltip title={item.name} placement="topLeft">
                                <p
                                  className={styles.text_overflow}
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.name}
                                </p>
                              </Tooltip>
                              {item?.city && (
                                <p
                                  style={{ color: "#0886D2" }}
                                  className={styles.text_overflow}
                                >
                                  <img src={mapPin} alt="map" /> {item?.city}
                                </p>
                              )}
                              {item?.contact_person_name && (
                                <p className={styles.text_overflow}>
                                  {item?.contact_person_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center" }}>
                  <img src={noSearchResultIcon} alt="no-result" />
                  <p>No Customer found</p>
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
}
