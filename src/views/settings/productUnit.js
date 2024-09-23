import React, { useEffect, useState, useContext } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Dropdown, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import Permissions from "../../helpers/permissions";
import {
  productUnitAction,
  productUnitDeleteService,
} from "../../redux/action/productUnitAction";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import AddProductUnitComponent from "./addProductUnit";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../../components/search-bar/searchInput";
import Pagination from "../../components/pagination/pagination";

const ProductUnitComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const [apiData, setApiData] = useState([]);
  const [rowData, setRowdata] = useState({});
  const [search, setSearch] = useState("");

  const context = useContext(Context);
  const { setDeleteModalOpen, setLoading } = context;

  const [newProductUnitOpen, setNewProductUnitOpen] = useState(false);

  const viewUnitPermission = Permissions("VIEW_UNIT");
  const createUnitPermission = Permissions("CREATE_UNIT");
  const editUnitPermission = Permissions("EDIT_UNIT");
  const deleteUnitPermission = Permissions("DELETE_UNIT");

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    search
      ? dispatch(productUnitAction(search, searchPageCount))
      : dispatch(productUnitAction(search, pageCount));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (state.productUnit.data !== "") {
      if (state.productUnit.data.data.error === false)
        setApiData(state.productUnit.data.data.data);
      setLoading(false);
    }
    if (state.productUnitDelete.data !== "") {
      if (state.productUnitDelete.data.data.error === false)
        setDeleteModalOpen(false);
    }
  }, [state]);

  const items = [
    ...(editUnitPermission
      ? [
          {
            key: "1",
            label: (
              <div
                onClick={() => setNewProductUnitOpen(true)}
                className="action-dropdown-list"
              >
                <img src={EditIcon} alt="delete" />
                Edit
              </div>
            ),
          },
        ]
      : []),
    ...(deleteUnitPermission
      ? [
          {
            key: "2",
            label: (
              <div
                onClick={() => setDeleteModalOpen(true)}
                className="action-dropdown-list"
              >
                <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
              </div>
            ),
          },
        ]
      : []),
  ];

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },

    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setRowdata(record);
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

  // delete function
  const handleDeleteCustomer = (data) => {
    if (!data) return;
    const apiData = {
      name: rowData.name,
    };
    dispatch(productUnitDeleteService(apiData));
    setTimeout(() => {
      dispatch(productUnitAction("", pageCount));
    }, 400);
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
              placeholder="Search Product Unit"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />
            {createUnitPermission && (
              <button
                className="button_primary"
                onClick={() => {
                  setNewProductUnitOpen(true);
                  setRowdata({});
                }}
              >
                Add Product Unit
              </button>
            )}
          </div>

          <div
            style={{
              width: "1050px",
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            {viewUnitPermission && (
              <>
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={apiData || ""}
                  scroll={{ y: 500 }}
                />

                <Pagination list={apiData} search={search} />
              </>
            )}
          </div>
          <ConfirmDelete
            title={"Product Unit"}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
            }}
          />
          <AddProductUnitComponent
            {...{ newProductUnitOpen, setNewProductUnitOpen }}
            data={rowData}
            callBack={() => dispatch(productUnitAction(search, pageCount))}
          />
        </Content>
      </div>
    </>
  );
};

export default ProductUnitComponent;

const styleHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  width: "1050px",
};
