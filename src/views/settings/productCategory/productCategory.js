import React, { useEffect, useState, useContext } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Button, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../../context/Context";
import {
  deleteProductCategoryAction,
  productCategoryAction,
} from "../../../redux/action/productCategoryAction";
import Permissions from "../../../helpers/permissions";
import {
  DeleteIcon,
  EditIcon,
  TransferIcon,
  ViewIcon,
} from "../../../assets/globle";
import Dropdown from "antd/es/dropdown/dropdown";
import AddProductCategoryComponent from "./addProductCategory";
import SearchInput from "../../../components/search-bar/searchInput";
import Pagination from "../../../components/pagination/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryProductsDetails from "./categoryProductsDetails";
import "../../../components/back-confirmation/styles.css";

const ProductCategoryComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const [productCategoryList, setProductCategoryList] = useState([]);

  const [rowData, setRowdata] = useState("");
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [handleDetailAction, setHandleDetailAction] = useState({
    open: false,
    type: null,
    showDeleteOption: false,
  });

  const context = useContext(Context);
  const { setAddProductCategoryOpen, setLoading } = context;

  let viewProductCategory = Permissions("VIEW_PRODUCT_CATEGORY");
  let createProductCategory = Permissions("CREATE_PRODUCT_CATEGORY");
  let editProductCategory = Permissions("EDIT_PRODUCT_CATEGORY");
  let deleteProductCategory = Permissions("DELETE_PRODUCT_CATEGORY");

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { productCategory, getDeleteProductCategoryDelete } = state;

  const items = [
    rowData.product_count !== 0
      ? {
          key: "1",
          label: (
            <div
              onClick={() => handleDrawerAction("transfer")}
              className="action-dropdown-list"
            >
              <img
                src={TransferIcon}
                alt="view"
                style={{ filter: "invert(0.5)" }}
              />
              Transfer
            </div>
          ),
        }
      : null,
    rowData.product_count !== 0
      ? {
          key: "2",
          label: (
            <div
              onClick={() =>
                navigate(`/web/product?category=${rowData.name}&nav=true`)
              }
              className="action-dropdown-list"
            >
              <img src={ViewIcon} alt="view" /> View Details
            </div>
          ),
        }
      : null,
    editProductCategory && {
      key: "3",
      label: (
        <div
          onClick={() => {
            setAddProductCategoryOpen(true);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    deleteProductCategory && {
      key: "4",
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
      title: "Category Name",
      dataIndex: "name",
      render: (text, record) => (
        <div
          onClick={() =>
            record.product_count !== 0 &&
            navigate(`/web/product?category=${text}&nav=true`)
          }
          style={
            record.product_count !== 0
              ? { color: "#000", cursor: "pointer", fontWeight: 600 }
              : {}
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: "No. of Products",
      dataIndex: "product_count",
    },
    ...(editProductCategory || deleteProductCategory
      ? [
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
        ]
      : []),
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "1050px",
  };

  const handleDeleteCustomer = () => {
    handleDrawerAction("delete");
  };

  const handleDrawerAction = (value, deleteOption = false) => {
    setHandleDetailAction({
      open: true,
      type: value,
      showDeleteOption: deleteOption,
    });
  };

  useEffect(() => {
    search
      ? dispatch(productCategoryAction(search, searchPageCount))
      : dispatch(productCategoryAction("", pageCount));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (productCategory.data && !productCategory.data.data.error) {
      setProductCategoryList(productCategory.data.data.data);
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
    if (
      getDeleteProductCategoryDelete.data &&
      !getDeleteProductCategoryDelete.data.data.error
    ) {
      search
        ? dispatch(productCategoryAction(search, searchPageCount))
        : dispatch(productCategoryAction("", pageCount));
    }
  }, [state]);

  return (
    <>
      <div className="distributor_list">
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
              placeholder="Search Product Category"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />
            {createProductCategory && (
              <button
                className="button_primary"
                onClick={() => {
                  setRowdata("");
                  setAddProductCategoryOpen(true);
                }}
              >
                Add Product Category
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
            {viewProductCategory && (
              <>
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={productCategoryList}
                  scroll={{ y: 500 }}
                />
                <Pagination list={productCategoryList} search={search} />
              </>
            )}
          </div>
          <DeleteModal
            isOpen={deleteModalOpen}
            isClose={setDeleteModalOpen}
            data={rowData}
            onTransfer={(event) =>
              event && handleDrawerAction("transfer", true)
            }
            onDelete={(value) => value.action && handleDeleteCustomer(value)}
          />
          <CategoryProductsDetails
            action={handleDetailAction}
            handleAction={setHandleDetailAction}
            data={rowData}
          />
          <AddProductCategoryComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default ProductCategoryComponent;

const DeleteModal = ({ isOpen, isClose, data, onTransfer, onDelete }) => {
  const dispatch = useDispatch();

  const onCancel = () => {
    isClose(false);
  };

  const handleTransfer = () => {
    onTransfer(true);
    onCancel();
  };

  const handleDelete = () => {
    onDelete({
      action: true,
      is_category_delete: true,
      is_delete_all_products: true,
    });
    onCancel();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      centered
      title={
        <div style={{ padding: "10px 20px", fontFamily: "Poppins" }}>
          <div style={{ fontSize: 20, padding: "10px 0" }}>
            Delete this Product Category?
          </div>
          {data?.product_count === 0 ? (
            <>
              <div style={{ color: "#727176", fontSize: 13 }}>
                Are You Sure, You want to Delete Your Product Category ?
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                }}
              >
                <Button
                  className="button_secondary"
                  style={{ padding: "0px 20px" }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="button_primary"
                  style={{ borderRadius: 5 }}
                  onClick={() => {
                    dispatch(deleteProductCategoryAction(data.id, true, true));
                    onCancel();
                  }}
                >
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ color: "#727176", fontSize: 13 }}>
                All the {data?.product_count} products, of this product category
                will be deleted. You can transfer all {data?.product_count}{" "}
                products to another{" "}
                <span style={{ color: "#000" }}>Product Category</span> by
                clicking
                <span style={{ color: "#000" }}>Transfer</span> or you can
                transfer these products individually from the respective product
                edit section.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                }}
              >
                <Button
                  className="button_secondary"
                  style={{ padding: "0px 20px" }}
                  onClick={handleDelete}
                >
                  Delete {data?.product_count} Products
                </Button>
                <Button
                  className="button_primary"
                  style={{ borderRadius: 5 }}
                  onClick={handleTransfer}
                >
                  Transfer {data?.product_count} Products
                </Button>
              </div>
            </>
          )}
        </div>
      }
      footer={[]}
    ></Modal>
  );
};
