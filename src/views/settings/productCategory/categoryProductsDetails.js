import React, { useEffect } from "react";
import { Button, Checkbox, Drawer } from "antd";
import styles from "./productCategory.module.css";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import { useState } from "react";
import { BASE_URL_V1, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductCategoryAction } from "../../../redux/action/productCategoryAction";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import Cookies from "universal-cookie";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const cookies = new Cookies();

const CategoryProductsDetails = ({ action, handleAction, data }) => {
  let productCategoryAPI = `${BASE_URL_V1}/organization/${org_id}/category/?is_with_id=true`;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { product } = state;

  const { id, name, product_count } = data;

  const [productCategory, setProductCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [transferConfirm, setTransferConfirm] = useState(false);

  const [productList, setProductList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const onClose = () => {
    handleAction({ open: false, type: null });
    setProductCategory(null);
    setProductList([]);
    setPageNo(0);
    setHasMore(true);
    setTransferConfirm(false);
  };

  const header =
    action.type === "delete"
      ? {
          head: <>Delete {name}</>,
          sub_head: `Delete ${product_count} Products along with it`,
        }
      : action.type === "transfer" && {
          head: "Transfer Products",
          sub_head: (
            <>
              of <b>{name}</b>
            </>
          ),
        };

  const handleProductTransfer = () => {
    dispatch(deleteProductCategoryAction(id, false, false, productCategory.id));
  };

  const handleDelete = () => {
    dispatch(deleteProductCategoryAction(id, true, true));
    onClose();
  };

  useEffect(() => {
    if (action.open) {
      fetchData(pageNo).then((newData) => {
        setProductList(getUniqueObjects(productList.concat(newData)));
      });
    }
  }, [action.open, pageNo]);

  //   for infinite loop API calling
  const fetchData = async (page) => {
    const url = `${BASE_URL_V1}/organization/${org_id}/product/es/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, category: name };
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

  useEffect(() => {
    if (product.data && !product.data.data.error) {
      setProductList(product.data.data.data);
    }
  }, [state]);

  return (
    <div>
      <Drawer
        title={
          action.type !== "delete" && !transferConfirm ? (
            <div className={styles.header}>
              <div>{header.head}</div>
              <div className={styles.sub_header}>{header.sub_head}</div>
              <div className={styles.transfer_section}>
                <div>
                  Select Product Category to transfer{" "}
                  <span style={{ color: "red" }}>*</span>
                </div>
                <div className={styles.transfer_input}>
                  <SingleSelectSearch
                    apiUrl={productCategoryAPI}
                    onChange={(data) => setProductCategory(data || null)}
                    value={productCategory?.name}
                    params={{
                      placeholder: "Search Product Category",
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
            <></>
          )
        }
        onClose={onClose}
        open={action.open}
        width={500}
        footer={
          action.type === "delete" && !transferConfirm ? (
            <div
              style={{
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <Checkbox onChange={(e) => setConfirmDelete(e.target.checked)}>
                  Yes, delete all {product_count} Products
                </Checkbox>
              </div>
              <Button danger disabled={!confirmDelete} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          ) : action.type === "transfer" &&
            productCategory &&
            !transferConfirm ? (
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
          ) : (
            ""
          )
        }
      >
        {!transferConfirm ? (
          <div className={styles.container}>
            <div className={styles.list_head}>
              <div>Mapped Product List</div>
              <div>{product_count} Products</div>
            </div>

            <InfiniteScroll
              dataLength={productList.length}
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
                {productList.map((item, index) => (
                  <div className={styles.card} key={index} id="scrollableDiv">
                    <img src={item.display_pic_url} alt="img" />
                    <div>
                      <div className={styles.product_code}>{item.code}</div>
                      <div className={styles.product_name}>{item.name}</div>
                      <div className={styles.product_price}>
                        Buyer Price : {toIndianCurrency(item.price)}
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
              Are you sure, you want to delete this Product Category ?
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
              <Button className="button_primary" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CategoryProductsDetails;
