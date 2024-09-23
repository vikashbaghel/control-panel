import React, { useEffect, useState } from "react";
import { Checkbox, Col, Dropdown, Input, Row, Space } from "antd";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./filter.module.css";
import axios from "axios";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Staff } from "../../assets/navbarImages";
import WrapText from "../wrapText";
import { Filter } from "../../assets";

const cookies = new Cookies();

export const filterListConstants = {
  selectAllKey: "ALL",
  initialFilterState: {
    page: 1,
    search: "",
    data: [],
    hasMore: true,
    selection: [],
  },
  filterStyle: {
    height: 380,
  },
};

const FilterList = ({ filterOptions, activeFilters, filterAction }) => {
  const [selectedOption, setSelectedOption] = useState(filterOptions[0]);
  const [allFilterStates, setAllFilterStates] = useState({});
  const [filterInterface, setFilterInterface] = useState({});

  function fetchFilterState(selectedOption) {
    return {
      ...filterListConstants.initialFilterState,
      data: selectedOption.data || [],
      hasMore: !(selectedOption.data || []).length,
      selection: activeFilters[selectedOption.key]?.split(",") || [],
      ...allFilterStates[selectedOption.key],
    };
  }

  function storeFilterState(selectedOption, filters = {}) {
    setAllFilterStates((prev) => ({
      ...prev,
      [selectedOption.key]: filters,
    }));
  }

  function resetFilterState() {
    setAllFilterStates((prev) => {
      let obj = {};
      Object.keys(prev).map((k) => {
        obj[k] = { ...prev[k], selection: "" };
      });
      filterAction(obj);
      return obj;
    });
  }

  const applyFilterState = () => {
    filterAction(allFilterStates);
  };

  useEffect(() => {
    Object.keys(filterInterface).length &&
      filterInterface.setFilterState({
        ...fetchFilterState(selectedOption),
      });
  }, [activeFilters]);

  return (
    <Col>
      <div style={{ display: "flex", height: "100%" }}>
        <Col className={styles.filter_list} style={{ width: 210 }}>
          {filterOptions.map((data, index) => {
            const selected = data.key === selectedOption.key;
            return (
              <Col key={`${data.label}-${index}`}>
                <Space
                  align="center"
                  style={{ height: 45, width: 188 }}
                  className={`${styles.option} ${
                    selected ? styles.active_option : ""
                  }`}
                  onClick={() => {
                    setSelectedOption(data);
                  }}
                >
                  <div>{data.label}</div>
                </Space>
              </Col>
            );
          })}
        </Col>
        <Col flex={1}>
          <FilterView
            key={selectedOption.key}
            {...{
              selectedOption,
              fetchFilterState,
              storeFilterState,
              setFilterInterface,
            }}
          />
        </Col>
      </div>
      <div className={styles.filter_footer}>
        <button className="button_secondary" onClick={resetFilterState}>
          Reset
        </button>
        <button className="button_primary" onClick={applyFilterState}>
          Apply
        </button>
      </div>
    </Col>
  );
};

const FilterView = ({
  selectedOption,
  fetchFilterState,
  storeFilterState,
  setFilterInterface,
}) => {
  const [filterState, setFilterState] = useState({
    ...fetchFilterState(selectedOption),
  });

  function updateFilterState(obj = {}) {
    setFilterState((prev) => ({ ...prev, ...obj }));
  }

  const fetchData = async (filterState) => {
    if (filterState.hasMore) {
      const headers = { Authorization: cookies.get("rupyzToken") };
      const params = {
        page_no: filterState.page,
        name: filterState.search,
      };
      await axios
        .get(selectedOption.source, { headers, params })
        .then((res) => {
          const data = res.data.data;
          if (filterState.page === 1) {
            updateFilterState({ data });
          } else {
            updateFilterState({ data: filterState.data.concat(data) });
          }
          updateFilterState({ page: filterState.page + 1 });
          if (data.length !== 30) return updateFilterState({ hasMore: false });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCheckbox = (ele) => {
    if (filterState.selection.includes(ele.id)) {
      updateFilterState({
        selection: filterState.selection.filter((id) => id !== ele.id),
      });
    } else {
      updateFilterState({
        selection:
          ele.id === filterListConstants.selectAllKey
            ? [filterListConstants.selectAllKey]
            : filterState.selection.includes(filterListConstants.selectAllKey)
            ? [ele.id]
            : [...filterState.selection, ele.id],
      });
    }
  };

  useEffect(() => {
    setFilterInterface &&
      setFilterInterface({
        setFilterState,
      });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(filterState);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filterState.search]);

  useEffect(() => {
    storeFilterState(selectedOption, filterState);
  }, [filterState]);

  return (
    <div>
      {selectedOption.search && (
        <>
          <Col
            style={{
              padding: "5px 10px",
              background: "#fff",
            }}
          >
            <Input
              allowClear
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{
                height: 35,
              }}
              value={filterState.search}
              onChange={(event) => {
                updateFilterState({
                  page: 1,
                  data: [],
                  hasMore: true,
                  search: event.target.value,
                });
              }}
            />
          </Col>
        </>
      )}
      <InfiniteScroll
        dataLength={(filterState.data || []).length}
        next={() => fetchData(filterState)}
        hasMore={filterState.hasMore}
        height={
          filterListConstants.filterStyle.height -
          72 -
          (selectedOption.search ? 45 : 0)
        }
        loader={
          filterState.hasMore === true ? (
            <h4 style={{ textAlign: "center" }}>Loading...</h4>
          ) : (
            <></>
          )
        }
        scrollableTarget="scrollableDiv"
      >
        <div id="scrollableDiv">
          {filterState.data.length === 0 && !filterState.hasMore && (
            <Col align="middle" style={{ padding: 10, fontSize: 14 }}>
              No Data Available
            </Col>
          )}
          {(filterState.data || [])?.map((item, ind) => {
            let ele = {
              ...item,
              id: `${item[selectedOption.sourceItemKey || "id"]}`,
            };
            return (
              <div
                key={`${ele.name}-${ind}`}
                className={styles.list_group}
                onClick={() => handleCheckbox(ele)}
                style={{ height: 40 }}
              >
                <Checkbox checked={filterState.selection.includes(ele.id)} />
                {!(selectedOption.data || []).length &&
                  !selectedOption.sourceExcludePics && (
                    <img
                      src={ele.pic_url || Staff}
                      width={20}
                      height={20}
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                <WrapText width={200}>{ele.name}</WrapText>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

const ListFilters = ({
  filterOptions,
  activeFilters,
  filterAction,
  height = 40,
  filterView,
}) => {
  return (
    <Dropdown
      overlayClassName="defaultStyle"
      dropdownRender={(v) => (
        <div
          className={`ant-dropdown-menu ${styles.filter}`}
          style={{ ...filterListConstants.filterStyle }}
        >
          <FilterList
            key={Object.values(activeFilters || {}).flatMap(
              (value) => value.split(",").length
            )}
            {...{ filterOptions, activeFilters, filterAction }}
          />
        </div>
      )}
      placement="bottomRight"
    >
      {filterView ? (
        filterView()
      ) : (
        <div
          className="tertiary-button"
          style={{ width: 120, height, color: "#727176" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <img
              src={Filter}
              alt="filter"
              style={{
                height: 23,
                width: 23,
              }}
            />
            <div>Filters</div>
            <div>
              <CaretDownOutlined />
            </div>
          </div>
        </div>
      )}
    </Dropdown>
  );
};

export default ListFilters;
