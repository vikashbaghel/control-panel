import React, { useEffect } from "react";
import { Button, Drawer } from "antd";
import styles from "./customerType.module.css";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import { useState } from "react";
import { BASE_URL_V2, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import axios from "axios";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import Address from "../../../components/viewDrawer/distributor-details/address";
import { deleteCustomerType as deleteCustomerTypeAPI } from "../../../redux/action/cutomerTypeAction";
import InfiniteScroll from "react-infinite-scroll-component";

const cookies = new Cookies();

const TransferCustomerType = ({ action, handleAction, data }) => {
  let customerTypeAPI = `${BASE_URL_V2}/organization/${org_id}/customer/type/`;
  const dispatch = useDispatch();

  const { id, name, customer_count } = data;

  const [customerType, setCustomerType] = useState(null);
  const [transferConfirm, setTransferConfirm] = useState(false);
  //   state to manage inifnity loop
  const [customerList, setCustomerList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const onClose = () => {
    handleAction({ open: false, type: null });
    setCustomerType(null);
    setTransferConfirm(false);
    setCustomerList([]);
    setPageNo(0);
    setHasMore(true);
  };

  const header = {
    head: "Transfer Customers",
    sub_head: (
      <>
        of <b>{name}</b>
      </>
    ),
  };

  const handleProductTransfer = (value) => {
    dispatch(deleteCustomerTypeAPI(id, customerType.id, value));
    if (value) {
      onClose();
    }
  };

  //   for infinite loop API calling
  const fetchData = async (page) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, customer_type: name };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length != 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  // Function to check for object equality based on properties
  const getUniqueObjects = (arr) => {
    const uniqueObjects = arr.filter(
      (obj, index, self) =>
        index ===
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(obj))
    );
    return uniqueObjects;
  };

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  const backgroundColor = {
    backgroundColor:
      data?.customer_level === "LEVEL-1"
        ? "#FDE3C9"
        : data?.customer_level === "LEVEL-2"
        ? "#DFF3CE"
        : "#D1F2FB",
  };

  useEffect(() => {
    if (action.open) {
      fetchData(pageNo).then((newData) => {
        setCustomerList(getUniqueObjects(customerList.concat(newData)));
      });
    }
  }, [action.open, pageNo]);

  return (
    <div>
      <Drawer
        title={
          !transferConfirm ? (
            <div className={styles.header}>
              <div>{header.head}</div>
              <div className={styles.sub_header}>{header.sub_head}</div>
              <div className={styles.transfer_section}>
                <div>
                  Select Customer Type to transfer{" "}
                  <span style={{ color: "red" }}>*</span>
                </div>
                <div className={styles.transfer_input}>
                  <SingleSelectSearch
                    apiUrl={customerTypeAPI}
                    onChange={(data) => setCustomerType(data || null)}
                    value={customerType?.name}
                    params={{
                      placeholder: "Search Customer Type",
                      style: { width: "400px", height: "auto" },
                    }}
                    optionFilter={(arr) => {
                      return arr.filter((ele) => ele.id !== id);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        }
        onClose={onClose}
        open={action.open}
        width={500}
        footer={
          customerType &&
          !transferConfirm && (
            <div
              style={{
                padding: "20px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                className="button_primary"
                style={{ height: "38px" }}
                onClick={() => {
                  action.showDeleteOption
                    ? setTransferConfirm(true)
                    : onClose();
                  handleProductTransfer(false);
                }}
              >
                Transfer
              </Button>
            </div>
          )
        }
      >
        {!transferConfirm ? (
          <div className={styles.container}>
            <div className={styles.list_head}>
              <div>Mapped Customer List</div>
              <div>{customer_count} Customers</div>
            </div>

            <InfiniteScroll
              dataLength={customerList.length}
              next={handleLoadMore}
              hasMore={hasMore}
              height={"70vh"}
              loader={
                hasMore === true ? (
                  <h4 style={{ textAlign: "center" }}>Loading...</h4>
                ) : (
                  <></>
                )
              }
              scrollableTarget="scrollableDiv"
            >
              <div className={styles.card_group}>
                {customerList.map((item, index) => (
                  <div className={styles.card} key={index} id="scrollableDiv">
                    <div
                      className={styles.side_banner}
                      style={backgroundColor}
                      title={item.customer_level_name}
                    >
                      {item.customer_level_name}
                    </div>
                    <img
                      src={item.logo_image_url || customerIcon}
                      alt={"customer"}
                    />
                    <div>
                      <div className={styles.customer_name}>{item.name}</div>
                      <div className={styles.customer_address}>
                        <Address data={item} mapPinImg={true} />
                      </div>
                      <div className={styles.customer_contact}>
                        {item.contact_person_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "50%" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: " 350px",
                margin: "0 auto",
              }}
            >
              Delete {name}
            </div>
            <div style={{ color: "#727176", marginTop: 10 }}>
              Are you sure, you want to delete this Customer Type ?
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                marginTop: 20,
              }}
            >
              <Button
                className="button_secondary"
                style={{ padding: "0 20px" }}
                onClick={onClose}
              >
                Keep
              </Button>
              <Button
                className="button_primary"
                onClick={() => handleProductTransfer(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TransferCustomerType;
