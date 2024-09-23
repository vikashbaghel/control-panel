import axios from "axios";
import Cookies from "universal-cookie";
import { Input, Modal, Radio } from "antd";
import { useEffect, useState } from "react";
import styles from "./chooseActivity.module.css";
import { SearchOutlined } from "@ant-design/icons";
import WrapText from "../../../components/wrapText";
import { BASE_URL_V2, org_id } from "../../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import noSearchDataIcon from "../../../assets/globle/no-results.svg";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import CustomerDetailCard, {
  getChildLevelName,
} from "../../../components/viewDrawer/distributor-details/customerDetailCard";
import { preference } from "../../../services/preference-service";

export default function SelectParentCustomerForOrder({
  selectParentModal,
  setSelectParentModal,
}) {
  const cookies = new Cookies();
  const { handleAction, detail } = selectParentModal;

  const [timer, setTimer] = useState(null);
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [hasParents, setHasParents] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);

  const parentName = detail?.id
    ? getChildLevelName(
        {
          id: 1,
          customer_level: detail?.customer_level,
        },
        "parent"
      )
    : "";

  const createOrder = (data = []) => {
    handleAction({
      ...detail,
      parent_id: selectedParent?.id || data?.[0]?.id,
      parent_name: selectedParent?.name || data?.[0]?.name,
    });
    onClose();
  };

  const onClose = () => {
    setHasParents(false);
    setSearchValue();
    setSelectedParent({});
    setData([]);
    setSelectParentModal({});
  };

  const fetchData = async (page, search) => {
    if (!detail?.id) return;
    if (
      detail.customer_level === "LEVEL-1" ||
      !preference.get("enable_customer_level_order")
    )
      return createOrder();

    const apiUrl = `${BASE_URL_V2}/organization/${org_id}/customer/${detail?.id}/mapping/parents/?selected=true&ignore_mapping=true&customer_level=${detail?.customer_level}`;

    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, name: search };

    const res = await axios.get(apiUrl, { headers, params });

    if (!search && res.data.data.length === 1)
      return createOrder(res.data.data);
    else if (res.data.data.length < 30) setHasMore(false);
    setHasParents(true);
    return res.data.data;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    const delayDebounceFn = setTimeout(() => {
      setData([]);
      setHasMore(true);
      setPageNo(-1);
      setSearchValue(value);
    }, 700);
    setTimer(delayDebounceFn);
  };

  useEffect(() => {
    if (pageNo === -1) {
      setPageNo(1);
    } else {
      fetchData(pageNo, searchValue).then((newData) => {
        if (pageNo === 1) setData(newData);
        else setData(data.concat(newData));
      });
    }
  }, [pageNo, detail]);

  if (!hasParents && !data?.length) return <div />;

  return (
    <Modal
      open={!!Object.keys(detail)?.length}
      onCancel={onClose}
      centered
      width={600}
      title={<div className={styles.modal_head}>Select {parentName}</div>}
      footer={
        <div className={styles.modal_footer}>
          <button
            type="button"
            className="button_secondary"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className={
              selectedParent?.id ? "button_primary" : "button_primary_disabled"
            }
            onClick={createOrder}
            disabled={!selectedParent?.id}
          >
            Proceed
          </button>
        </div>
      }
      style={{ fontFamily: "Poppins" }}
    >
      <div style={{ padding: "1.5em" }}>
        <CustomerDetailCard
          data={detail}
          hideActionButton={true}
          showDropdown={false}
        />
        <br />
        {!searchValue && !data.length ? (
          <p style={{ textAlign: "center" }}>
            No {parentName} is assigned to the {detail?.name}. Please assign.
          </p>
        ) : (
          <div>
            <div style={{ paddingBottom: "1em" }}>
              <Input
                size="small"
                prefix={<SearchOutlined />}
                placeholder={`Search ${parentName}`}
                onChange={handleSearch}
              />
            </div>
            {searchValue && !data.length ? (
              <div
                style={{ textAlign: "center", height: 250, color: "#727176" }}
              >
                <img src={noSearchDataIcon} alt="no-data" />
                <div>No matching results</div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={data.length}
                next={() => {
                  const page = pageNo + 1 || 1;
                  setPageNo(page);
                }}
                hasMore={hasMore}
                height={250}
                loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                <div className={styles.distributor_list_container}>
                  {data?.map((item, index) => (
                    <div
                      key={index}
                      className={`${styles.distributor_list_option} ${
                        selectedParent?.id === item.id
                          ? styles.active_distributor_list_option
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedParent({ id: item.id, name: item.name })
                      }
                    >
                      <div className={styles.distributor_list_option_name}>
                        <img
                          src={item.logo_image_url || customerIcon}
                          alt={item.name}
                          style={{ width: 40, height: 40, borderRadius: 4 }}
                        />
                        <WrapText width={250}>{item.name}</WrapText>
                      </div>
                      <Radio checked={selectedParent?.id === item.id} />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
