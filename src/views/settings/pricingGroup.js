import React, { useEffect, useState, useContext } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Dropdown, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { useNavigate } from "react-router";
import {
  deletePricingGroup,
  pricingGroupListService,
} from "../../redux/action/pricingGroupAction";
import AddPricingGroupComponent from "./addPricingGroup";
import { BulkUpload, DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { routeLinks } from "../../routes/routesConstant";
import Cookies from "universal-cookie";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../../components/search-bar/searchInput";
import Pagination from "../../components/pagination/pagination";

const PricingGroupComponent = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [pricingList, setPricingList] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState("");

  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  // for handle delete modal
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const context = useContext(Context);
  const { setProductPricingGroupAddOpen, setDeleteModalOpen, setLoading } =
    context;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    search
      ? dispatch(pricingGroupListService(searchPageCount, search, true))
      : dispatch(pricingGroupListService(pageCount, "", true));
  }, [pageCount, search, searchPageCount]);

  useEffect(() => {
    if (state.getPricingGroupingList.data !== "") {
      if (state.getPricingGroupingList.data.data.error === false) {
        setPricingList(state.getPricingGroupingList.data.data.data);
        setLoading(false);
      }
    }
  }, [state]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setProductPricingGroupAddOpen(true);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    admin && {
      key: "2",
      label: (
        <div>
          <div
            onClick={() =>
              navigate(
                `${routeLinks.PRICING_GROUP_BULK_UPLOAD}?id=${rowData.id}`
              )
            }
            className="action-dropdown-list"
          >
            <img src={BulkUpload} alt="delete" />
            Bulk Upload
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 300,
      render: (text, record) => (
        <a
          onClick={() => {
            navigate(
              `/web/product-pricing/?name=${record.name}&id=${record.id}&description=${record.description}&product-count=${record.product_count}`
            );
          }}
          style={{ color: "Black", fontWeight: "600" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "No. of Product",
      dataIndex: "product_count",
      key: "product_count",
      width: 150,
      align: "center",
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setRowData(record);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
            className="action-dropdown"
          >
            <div className="clickable">
              <MoreOutlined className="action-icon" />
            </div>
          </Dropdown>
        </div>
      ),
    },
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "1050px",
  };

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      dispatch(deletePricingGroup(rowData.id, true));
      setTimeout(() => {
        dispatch(pricingGroupListService("", pageCount));
      }, 400);
    }
  };

  return (
    <>
      <div className="table_list position-rel">
        <Content
          style={{
            padding: "0px 24px",
            margin: 0,
            height: "82vh",
            background: "transparent",
          }}
        >
          <div style={styleHeader}>
            <SearchInput
              placeholder="Search Pricing Group"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />

            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="button_primary"
                onClick={() => {
                  setProductPricingGroupAddOpen(true);
                  setRowData({});
                }}
                style={{ borderRadius: "5px", marginLeft: 20 }}
              >
                Add Pricing Group
              </button>
            </div>
          </div>

          <div
            style={{
              width: "1050px",
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            <Table
              pagination={false}
              columns={columns}
              dataSource={pricingList !== "" ? pricingList : ""}
              scroll={{ y: 500 }}
            />
            <Pagination list={pricingList} search={search} />
          </div>
          <ConfirmDelete
            title={"Pricing Group"}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
            }}
          />
          <AddPricingGroupComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default PricingGroupComponent;
