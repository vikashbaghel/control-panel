import { Button, Checkbox, Col, Modal, Row, Space, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productService, productView } from "../../redux/action/productAction";
import Context from "../../context/Context";
import { useNavigate } from "react-router";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import noImageFound from "../../assets/no-photo-available.gif";
import Permissions from "../../helpers/permissions";
import Add from "../../assets/add-icon.svg";
import styles from "./product.module.css";
import ProductDetail from "./productDetail";
import ProductFilters from "./productFilter";
import AdminLayout from "../../components/AdminLayout";
import filterService from "../../services/filter-service";
import Paginator from "../../components/pagination";
import { ArrowLeft } from "../../assets/globle";
import qrIcon from "../../assets/qr_code.svg";
import WrapText from "../../components/wrapText";
import ProductQR, { ProductBulkQR, QRHeader } from "./productQR";

const constants = {
  defaultProductQR: {
    product: {},
  },
};

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState("");
  const [productQR, setProductQR] = useState(constants.defaultProductQR);
  const [productDataId, setProductDataId] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isGlobalSelected, setIsGlobalSelected] = useState(false);
  const [bulkQR, setBulkQR] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    ...filterService.getFilters(),
  });

  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { setLoading } = context;
  let viewProductPermission = Permissions("VIEW_PRODUCT");
  let createProductPermission = Permissions("CREATE_PRODUCT");

  const selectionColumns = [
    {
      title: (
        <Space size="large">
          {isGlobalSelected ? (
            <div>All results selected</div>
          ) : (
            <Space>
              <div>{selectedRowKeys.length} Selected</div>
              <a
                type="default"
                onClick={() => {
                  setSelectedRowKeys([]);
                }}
              >
                Clear
              </a>
            </Space>
          )}
          {isGlobalSelected ? (
            <a type="default" onClick={() => setIsGlobalSelected(false)}>
              Undo
            </a>
          ) : (
            <a
              type="default"
              onClick={() => {
                setIsGlobalSelected(true);
              }}
            >
              Select all results
            </a>
          )}
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      width: 300,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <OutOfStockWrapper
            show={record.is_out_of_stock}
            inActiveLabel={record.is_published}
          >
            <img
              style={{
                width: "100px",
                height: "100px",
                borderRadius: 5,
                padding: 5,
                background: "#fff",
              }}
              src={
                record.display_pic_url ? record.display_pic_url : noImageFound
              }
            />
          </OutOfStockWrapper>
          <div
            style={{
              width: "170px",
              color: "#000",
              fontWeight: "600",
              marginLeft: "10px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
              }}
            >
              {text.replace(record?.variant_name, "")}
            </div>
            <div style={{ color: "#727176", fontSize: 12 }}>
              {record?.variant_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      render: (text, record) => <div style={{ minWidth: 100 }}>{text}</div>,
    },
    {
      title: "Category",
      width: 120,
      dataIndex: "category",
      render: (text) => (
        <div style={{ minWidth: 120 }}>
          <WrapText width={120}>{text}</WrapText>
        </div>
      ),
    },

    {
      title: "Brand",
      dataIndex: "brand",
      render: (text) => (
        <div style={{ width: 120 }}>
          <WrapText width={120}>{text}</WrapText>
        </div>
      ),
    },
    {
      title: "Pkg. Size",
      dataIndex: "packageSize",
      render: (text, record) =>
        record?.packaging_level && (
          <WrapText width={200}>
            {record?.packaging_level[0]?.size} <>&#10005; </>
            {record.unit} = {record?.packaging_level[0]?.unit}
          </WrapText>
        ),
    },
    {
      title: "MRP",
      dataIndex: "mrp_price",
      render: (text, record) => (
        <div style={{ minWidth: 120 }}>
          {toIndianCurrency(record.mrp_price, 4)} / {record.mrp_unit}
        </div>
      ),
    },
    {
      title: "Buyer Price",
      dataIndex: "price",
      render: (text, record) => (
        <div style={{ minWidth: 120, color: "#000", fontWeight: "600" }}>
          <div>
            {toIndianCurrency(record.price, 4)} / {record.unit}
          </div>
          <div style={{ color: "red", fontSize: "10px" }}>
            (GST {record.gst} %{" "}
            {record.gst_exclusive === false ? "incl." : "Extra"})
          </div>
        </div>
      ),
    },
    {
      title: "QR Code",
      fixed: "right",
      dataIndex: "qr_code",
      align: "center",
      className: styles.bg_white,
      render: (_, record) => (
        <Col style={{ width: 140 }} align="middle">
          <button
            style={{ width: 110 }}
            className="button_secondary"
            onClick={(e) => {
              e.stopPropagation();
              setProductQR({
                product: record,
              });
            }}
          >
            <Space align="middle" style={{ marginTop: 4 }}>
              <img src={qrIcon} alt="QR" style={{ height: 18 }} />
              View
            </Space>
          </button>
        </Col>
      ),
    },
  ];

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  useEffect(() => {
    if (Object.keys(activeFilters).length) {
      let { page, query } = activeFilters;
      let params = {
        ...activeFilters,
        name: query,
      };

      dispatch(productService(page || 1, params));
      setProductDataId("");
    }
  }, [activeFilters]);

  useEffect(() => {
    if (!window.location.search) {
      filterService.setFilters({ page: 1 });
    }
  }, [window.location.search]);

  useEffect(() => {
    if (state.product.data !== "") {
      if (state.product.data.data.error === false) {
        const arr = state.product.data.data.data;
        setApiData(arr);
        setLoading(false);
      }
    }
    if (state.productView.data !== "") {
      if (state.productView.data.data.error === false) {
        setProductDataId(state.productView.data.data.data);
      }
    }
    if (state.addProduct.data && !state.addProduct.data.data.error) {
      setTimeout(() => {
        dispatch(
          productService(activeFilters?.page || 1, {
            ...activeFilters,
            name: activeFilters?.query,
          })
        );
      }, 400);
    }
  }, [state]);

  useEffect(() => {
    if (!bulkQR) {
      setSelectedRowKeys([]);
      setIsGlobalSelected(false);
    }
  }, [bulkQR]);

  return (
    <>
      <AdminLayout
        title={
          <>
            {activeFilters["nav"] && (
              <img
                src={ArrowLeft}
                alt="arrow"
                onClick={() => {
                  navigate(-1);
                }}
                className="clickable"
              />
            )}{" "}
            Product List
          </>
        }
        search={{
          placeholder: "Search for Product, Product Code, Category",
          searchValue: (data) => {
            filterService.setFilters({ query: data });
          },
        }}
        panel={[
          <ProductFilters
            {...{ activeFilters }}
            onChange={(obj) => {
              filterService.setFilters(obj);
            }}
          />,
          ...(createProductPermission
            ? [
                <button
                  className="button_primary"
                  onClick={() => {
                    navigate("/web/product/add-product");
                  }}
                >
                  <img src={Add} alt="img" className={styles.add_icon} /> Add
                  Product
                </button>,
              ]
            : []),
        ]}
      >
        <Col className={styles.product_area}>
          {viewProductPermission ? (
            <div
              style={{
                width: productDataId ? "calc(100% - 360px)" : "100%",
              }}
            >
              <div>
                <Table
                  columns={
                    selectedRowKeys.length
                      ? columns.map((obj, i) => {
                          if (obj.dataIndex === "qr_code") {
                            return {
                              ...obj,
                              title: <QRHeader {...{ bulkQR, setBulkQR }} />,
                              render: (_, record) => (
                                <Col style={{ width: 140 }} align="middle">
                                  {obj.render(_, record)}
                                </Col>
                              ),
                            };
                          } else
                            return {
                              ...obj,
                              title: "",
                              ...(selectionColumns[i] || {}),
                            };
                        })
                      : columns
                  }
                  dataSource={apiData}
                  pagination={false}
                  style={{ cursor: "pointer" }}
                  scroll={{ y: 500 }}
                  onRow={(record, rowIndex) => ({
                    onClick: () => {
                      dispatch(productView(record.id));
                    },
                  })}
                  rowClassName={(record) => {
                    if (record.id === productDataId.id) {
                      return "custom-row-class";
                    }
                    return "";
                  }}
                  tableLayout="auto"
                  rowKey="id"
                  rowSelection={{
                    renderCell: (checked, record) => {
                      checked = checked || isGlobalSelected;
                      return (
                        <Col
                          style={{
                            padding: 8,
                            opacity: isGlobalSelected ? 0.5 : 1,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isGlobalSelected) {
                              setSelectedRowKeys((prev) => {
                                let arr = [...prev];
                                let i = arr.findIndex(
                                  (x) => x.id === record.id
                                );
                                if (i === -1) {
                                  arr = [...arr, record];
                                } else {
                                  arr.splice(i, 1);
                                }
                                return arr;
                              });
                            }
                          }}
                        >
                          <Checkbox {...{ checked }} />
                        </Col>
                      );
                    },
                    selectedRowKeys: [
                      ...(isGlobalSelected ? apiData : selectedRowKeys),
                    ].map((ele) => ele.id),
                    onChange: (allKeys, selectedRows) => {
                      //select all checkbox action
                      let currentPage = apiData.map((x) => x.id);
                      if (!isGlobalSelected) {
                        setSelectedRowKeys((selection) => {
                          let excludedSelection = [
                            ...selectedRowKeys.filter(
                              (x) => !currentPage.includes(x.id)
                            ),
                          ];
                          if (allKeys.length) {
                            return [...excludedSelection, ...apiData];
                          } else {
                            return excludedSelection;
                          }
                        });
                      }
                    },
                  }}
                />
              </div>
              <br />
              <br />
              <Paginator
                limiter={(apiData || []).length < 30}
                value={activeFilters["page"]}
                onChange={(i) => {
                  filterService.setFilters({ page: i });
                }}
              />
            </div>
          ) : (
            <>
              <Table {...{ columns }} />
            </>
          )}
          {productDataId && (
            <ProductDetail
              pageNumber={activeFilters["page"]}
              setProductDetail={setProductDataId}
            />
          )}
        </Col>
      </AdminLayout>
      <ProductQR
        {...productQR}
        onCancel={() => {
          setProductQR(constants.defaultProductQR);
        }}
      />
      <ProductBulkQR
        {...{ bulkQR, setBulkQR }}
        selectedProducts={!isGlobalSelected ? selectedRowKeys : []}
      />
    </>
  );
};

export default Product;

export const OutOfStockWrapper = ({ children, show, inActiveLabel }) => {
  return (
    <div
      className={
        !inActiveLabel ? styles.inactive_label : show ? styles.out_of_stock : ""
      }
    >
      {children}
    </div>
  );
};
