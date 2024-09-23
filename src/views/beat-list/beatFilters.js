import { Filter } from "../../assets";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { CrossIcon } from "../../assets/globle";
import { BASE_URL_V2, org_id } from "../../config";
import { CaretDownOutlined } from "@ant-design/icons";
import styles from "../../views/product/product.module.css";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";

const BeatFilters = ({ selectedValue, value }) => {
  const cookies = new Cookies();

  const sortByList = ["Newly Added", "Beat Name : A-Z", "Beat Name : Z-A"];
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const [productListShow, setProductListShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [sortBy, setSortBy] = useState(value.sort_by || "");
  const [sortOrder, setSortOrder] = useState(value.sort_order || "");
  const [selectedSort, setSelectedSort] = useState(
    value.sort_order === "DESC"
      ? "Beat Name : Z-A"
      : value.sort_order === "ASC"
      ? "Beat Name : A-Z"
      : sortByList[0]
  );
  const [assignedStaff, setAssignedStaff] = useState({
    id: value.staff_id,
    name: value.staff_name,
  });
  const [customer, setCustomer] = useState({
    id: value.customer_id,
    name: value.customer_name,
  });
  const [parentLevel, setParentLevel] = useState(value.parent_level || null);

  const [singleSelectSearch, setSingleSelectSearch] = useState();

  const queryParams = new URLSearchParams(window.location.search);

  const staffIdParams = queryParams.get("beats_staff_id");

  const handleSort = (value) => {
    setSelectedSort(value);

    switch (value) {
      case "Beat Name : Z-A":
        setSortBy("name");
        setSortOrder("DESC");
        break;
      case "Beat Name : A-Z":
        setSortBy("name");
        setSortOrder("ASC");
        break;
      default:
        setSortBy("");
        setSortOrder("");
    }
  };

  const handleApplyed = () => {
    selectedValue({
      sort_by: sortBy,
      sort_order: sortOrder,
      parent_level: parentLevel,
      customer_id: customer,
      staff_id: assignedStaff,
    });
    setFilterShow(false);
  };

  const handleReset = () => {
    setAssignedStaff({});
    setParentLevel();
    selectedValue({
      sort_by: sortBy,
      sort_order: sortOrder,
      parent_level: "",
      customer_id: "",
      staff_id: "",
    });
    setFilterShow(false);
  };

  useEffect(() => {
    selectedValue({
      sort_by: sortBy,
      sort_order: sortOrder,
      parent_level: parentLevel,
      customer_id: customer,
      staff_id: assignedStaff,
    });
  }, [sortBy, sortOrder]);

  return (
    <div className={styles.filter_container}>
      <div className={styles.product_group}>
        <div
          style={{ ...style.flex, width: "170px" }}
          onMouseOver={() => setProductListShow(true)}
          onMouseOut={() => setProductListShow(false)}
        >
          <span
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {selectedSort}
          </span>
          <span>
            <CaretDownOutlined style={{ color: "#727176" }} />
          </span>
        </div>
        <div
          className={`${styles.dropdown} ${
            productListShow ? styles.active_dropdown : ""
          }`}
          style={{ width: "170px" }}
        >
          {sortByList.map((ele, ind) => (
            <div
              key={ind}
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
          style={{ padding: 0 }}
        >
          <div className={styles.dropdown_header}>
            Filter{" "}
            <span>
              <img
                src={CrossIcon}
                alt="cancel"
                onClick={() => {
                  setFilterShow(!filterShow);
                  setCustomer({});
                  setParentLevel(null);
                  setAssignedStaff({});
                }}
                className={styles.cancel}
              />
            </span>
          </div>

          <div className={styles.dropdown_body}>
            <label>Customer Level</label>

            <div style={{ display: "flex", gap: "1em", paddingTop: "0.5em" }}>
              <p
                style={
                  parentLevel === "LEVEL-1"
                    ? style.selectedParentLevel
                    : style.parentLevel
                }
                onClick={() => {
                  setParentLevel("LEVEL-1");
                  setCustomer({});
                }}
              >
                {customerLevelList["LEVEL-1"]}
              </p>
              <p
                style={
                  parentLevel === "LEVEL-2"
                    ? style.selectedParentLevel
                    : style.parentLevel
                }
                onClick={() => {
                  setParentLevel("LEVEL-2");
                  setCustomer({});
                }}
              >
                {customerLevelList["LEVEL-2"]}
              </p>
            </div>
          </div>
          {parentLevel && (
            <div className={styles.dropdown_body}>
              <label>Select {customerLevelList[parentLevel]}</label>
              <br />
              <SingleSelectSearch
                key={parentLevel}
                apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true&customer_level=${parentLevel}`}
                onChange={(data) => {
                  setCustomer({ id: data?.id, name: data?.name });
                }}
                value={customer?.name}
                setInterface={setSingleSelectSearch}
                params={{
                  placeholder: `Search ${customerLevelList[parentLevel]}`,
                }}
              />
            </div>
          )}
          {!staffIdParams && (
            <div className={styles.dropdown_body}>
              <label>Assigned Staff</label>
              <br />
              <SingleSelectSearch
                apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
                onChange={(data) => {
                  setAssignedStaff({ id: data?.id, name: data?.name });
                }}
                value={assignedStaff?.name || undefined}
                params={{
                  placeholder: `Search Staff`,
                }}
              />
            </div>
          )}
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

export default BeatFilters;

const style = {
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  parentLevel: {
    margin: 0,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "10px",
    border: "2px solid #eee",
  },
  selectedParentLevel: {
    margin: 0,
    color: "#fff",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "10px",
    border: "2px solid #eee",
    background:
      "linear-gradient( 126deg, #322e80 0%, rgba(50, 46, 128, 0.84) 100% )",
  },
};
