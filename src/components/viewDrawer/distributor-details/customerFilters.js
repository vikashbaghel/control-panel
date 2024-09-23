import { Filter } from "../../../assets";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CrossIcon } from "../../../assets/globle";
import { BASE_URL_V2, org_id } from "../../../config";
import { CaretDownOutlined } from "@ant-design/icons";
import styles from "../../../views/product/product.module.css";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import { notification } from "antd";

const CustomerFilters = ({ selectedValue }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerId = searchParams.get("id");

  const [productListShow, setProductListShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);

  const sortByList = ["Name : 1-Z", "Name : Z-1", "Newly Added"];

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedSort, setSelectedSort] = useState(sortByList[0]);
  const [assignedStaff, setAssignedStaff] = useState({ id: "", name: null });
  const [customerTypeList, setCustomerTypeList] = useState([]);

  const handleSort = (value) => {
    setSelectedSort(value);
    switch (value) {
      case "Name : Z-1":
        setSortBy("name");
        setSortOrder("DESC");
        break;

      case "Outstanding Amout : Low-High":
        setSortBy("outstanding_amount");
        setSortOrder("ASC");
        break;
      case "Outstanding Amout : High-Low":
        setSortBy("outstanding_amount");
        setSortOrder("DESC");
        break;
      case "Newly Added":
        setSortBy("created_at");
        setSortOrder("");
        break;
      default:
        setSortBy("name");
        setSortOrder("ASC");
        break;
    }
  };

  const handleDelete = (name, item) => {
    if (name === "customerType") {
      let tempCategoryList = customerTypeList.filter((data) => data !== item);
      setCustomerTypeList(tempCategoryList);
      return;
    }
  };

  const handleApplyed = () => {
    selectedValue({
      sortBy,
      sortOrder,
      customerTypeList,
      staff_id: assignedStaff?.id,
    });
    setFilterShow(false);
  };

  const handleReset = () => {
    setCustomerTypeList([]);
    setAssignedStaff({});
    setSelectedSort(sortByList[0]);
    selectedValue({
      sortBy,
      sortOrder,
      customerTypeList: [],
      staff_id: "",
    });
    setFilterShow(false);
  };

  useEffect(() => {
    if (sortBy)
      selectedValue({
        sortBy,
        sortOrder,
        customerTypeList,
        staff_id: assignedStaff?.id,
      });
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (customerTypeList.length > 0 && !assignedStaff?.id) {
      handleReset();
    }
  }, [customerId]);

  return (
    <div className={styles.filter_container}>
      <div className={styles.product_group}>
        <div
          style={style.flex}
          onMouseOver={() => setProductListShow(true)}
          onMouseOut={() => setProductListShow(false)}
        >
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {selectedSort}
          </div>
          <span>
            <CaretDownOutlined style={{ color: "#727176" }} />
          </span>
        </div>
        <div
          className={`${styles.dropdown} ${
            productListShow ? styles.active_dropdown : ""
          }`}
        >
          {sortByList.map((ele, ind) => (
            <div
              key={ind}
              style={{ top: "100%" }}
              onClick={() => {
                handleSort(ele);
                setProductListShow(false);
              }}
              onMouseEnter={() => setProductListShow(true)}
              onMouseLeave={() => setProductListShow(false)}
              className={styles.list}
            >
              {ele}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.filter_group}>
        <div style={style.flex} onClick={() => setFilterShow(!filterShow)}>
          <span style={style.flex}>
            <img src={Filter} alt="filter" />
            &nbsp; Filter
          </span>
          <span>
            <CaretDownOutlined style={{ color: "#727176" }} />
          </span>
        </div>

        <div
          className={`${styles.dropdown} ${
            filterShow ? styles.active_dropdown : ""
          }`}
          style={{ width: "70%" }}
        >
          <div className={styles.dropdown_header}>
            Filter{" "}
            <span>
              <img
                src={CrossIcon}
                alt="cancel"
                onClick={() => setFilterShow(!filterShow)}
                className={styles.cancel}
              />
            </span>
          </div>

          <div className={styles.dropdown_body}>
            <label>Customer Type</label>
            <br />
            <br />
            <SingleSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/type/`}
              onChange={(data) => {
                if (!customerTypeList.includes(data.name)) {
                  setCustomerTypeList((prev) => [...prev, data?.name || null]);
                } else
                  notification.warning({ message: "Already Added to List" });
              }}
              value={null}
              params={{ placeholder: "Search Customer Type" }}
            />
            <div className={styles.selected_list}>
              {customerTypeList.map((item, index) => (
                <div className={styles.selected_list} key={index}>
                  {item}{" "}
                  <img
                    src={CrossIcon}
                    alt="cancel"
                    width={18}
                    style={{ marginLeft: 7, cursor: "pointer" }}
                    onClick={() => handleDelete("customerType", item)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.dropdown_body}>
            <label>Assigned Staff</label>
            <br />
            <br />
            <SingleSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
              onChange={(data) => {
                setAssignedStaff({
                  id: data?.id || 0,
                  name: data?.name || null,
                });
              }}
              value={assignedStaff.name}
              params={{ placeholder: "Search Staff" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              margin: "20px 20px 10px 20px",
            }}
          >
            <button className="button_secondary" onClick={handleReset}>
              Reset
            </button>
            <button
              className="button_primary"
              style={{ marginLeft: 20, border: 5, borderRadius: 5 }}
              onClick={handleApplyed}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;

const style = {
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
