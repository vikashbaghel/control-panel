import { useEffect, useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import styles from "../../views/product/product.module.css";

const GallerySorting = ({ value, selectedValue }) => {
  const sortByGroup = ["Newest", "Oldest"];
  const [filterShow, setFilterShow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");

  const handleSort = (value, created_at) => {
    setSelectedGroup(value);
    let sortOrder = null;

    // Determine sort order based on selected value
    if (value === "Newest") {
      sortOrder = "DESC";
    } else if (value === "Oldest") {
      sortOrder = "ASC";
    }

    selectedValue({
      sort_by: created_at, // Assuming 'created_at' is your sorting parameter
      sort_order: sortOrder, // Set the determined sort order
    });
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".filter_container")) {
      setFilterShow(false);
    }
  };

  useEffect(() => {
    setSelectedGroup(
      value?.sort_order === "ASC" ? sortByGroup[1] : sortByGroup[0]
    );
  }, [value]);

  useEffect(() => {
    if (filterShow) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [filterShow]);

  return (
    <div className="filter_container">
      <div className={styles.filter_group}>
        <div
          style={{
            display: "flex",
            width: "330px",
            position: "relative",
            justifyContent: "space-around",
          }}
          onMouseOver={() => setFilterShow(true)}
          onMouseOut={() => setFilterShow(false)}
        >
          <span style={{ display: "flex", width: "290px", gap: "5px" }}>
            Sort by - {selectedGroup}
          </span>
          <span>
            <CaretDownOutlined style={{ color: "#727176" }} />
          </span>
        </div>
        <div
          className={`${styles.dropdown} ${
            filterShow ? styles.active_dropdown : ""
          }`}
          style={{
            width: "320px",
            position: "absolute",
            top: "100%",
            zIndex: 10,
          }}
          onMouseOver={() => setFilterShow(true)}
          onMouseOut={() => setFilterShow(false)}
        >
          {sortByGroup.map((ele, ind) => (
            <div
              key={ind}
              onClick={() => handleSort(ele)}
              className={styles.list}
            >
              {ele}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySorting;
