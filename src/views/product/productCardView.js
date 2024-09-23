import React, { useState, useEffect, useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./productCardView.module.css";
import { BASE_URL_V1, org_id } from "../../config";
import Cookies from "universal-cookie";
import axios from "axios";
import { ArrowLeft } from "../../assets/globle";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { NoPhoto, Product_list_empty } from "../../assets";
import Context from "../../context/Context";
import cartService, {
  buyerPriceWithTelescope,
} from "../../services/cart-service";
import ProductFilters from "./productFilter";
import AddToCartWithVariants from "./AddToCartWithVariants";
import AddToCartButton from "../../components/addToCartButton";

const constants = {
  defaultVariantModal: {
    open: false,
    variantDetails: {},
  },
};

const ProductCardView = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setGeoLocationAction, setCartNumber } = context;
  const queryParameters = new URLSearchParams(window.location.search);
  const customerName = queryParameters.get("name");
  const customerId = queryParameters.get("id");

  //   state to manage list data
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [filterValues, setFilterValues] = useState("");

  const [variantModal, setVariantModal] = useState(
    constants.defaultVariantModal
  );

  const [loader, setLoader] = useState(true);

  const reset = () => {
    setLoader(true);
    setData([]);
    setHasMore(true);
    setPageNo(1);
  };

  //   for list items API calling
  const fetchData = async (page, id, name, filters) => {
    const url = `${BASE_URL_V1}/organization/${org_id}/product/es/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      page_no: page,
      customer_id: id,
      name: name,
      sort_by: filters?.sort_by,
      sort_order: filters?.sort_order,
      category: filters?.category,
      brand: filters?.brand,
    };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length != 30) {
      setHasMore(false);
    }
    setLoader(false);
    return newDataTemp.data.data;
  };

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
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

  //   initial call for API and whenever page count changes
  useEffect(() => {
    fetchData(pageNo, customerId, nameSearch, filterValues).then((newData) => {
      setData(getUniqueObjects(data.concat(newData)));
    });
  }, [pageNo, nameSearch, filterValues]);

  // for the search by name or brand
  const onSearch = (e) => {
    reset();
    return setTimeout(() => {
      setNameSearch(e.target.value);
    }, 500);
  };

  const onUpdate = (
    obj,
    callback = (obj) => {
      setVariantModal({ open: true, variantDetails: obj });
    }
  ) => {
    if (obj.primary_product && callback) {
      callback(obj);
    }
    let { distributor } = cartService.getCartDetails();
    //check if user tries to order for different distributor
    if (parseInt(distributor.id || 0) !== parseInt(customerId)) {
      setCartNumber(0);
      cartService.initCart({ id: customerId, name: customerName });
    }
    cartService.updateCartItem(obj);
  };

  // adding the cart product to the selected product Id list
  useEffect(() => {
    setGeoLocationAction({
      open: true,
      handleAction: () => navigate(-1),
      customer_id: customerId,
    });
    cartService.setEventListner((cartItems) => {
      setData((prev) => [...prev]); //re-render products
      setCartNumber((cartItems || []).length);
    });
  }, []);

  return (
    <div>
      <div className={styles.title}>
        <img
          src={ArrowLeft}
          alt="arrow"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/web/customer")}
        />
        <div>Create Order</div>
        <div>({customerName})</div>
      </div>
      <div className={styles.search_container}>
        <div className="search_input">
          <input
            placeholder="Search for Product"
            name="product"
            onChange={(e) => onSearch(e)}
            style={{ paddingRight: "40px" }}
          />
          <SearchOutlined />
        </div>
        <div style={{ marginRight: 35 }}>
          <ProductFilters
            className={styles.filter_container}
            activeFilters={filterValues}
            onChange={(updatedValues) => {
              reset();
              setFilterValues((currentValues) => ({
                ...currentValues,
                ...updatedValues,
              }));
            }}
          />
        </div>
      </div>
      <br />
      <InfiniteScroll
        dataLength={data.length}
        next={handleLoadMore}
        hasMore={hasMore}
        height={"75vh"}
        loader={
          hasMore === true ? (
            <h4 style={{ textAlign: "center" }}>Loading...</h4>
          ) : (
            <></>
          )
        }
        scrollableTarget="scrollableDiv"
      >
        <div className={styles.product_list_container}>
          {data.length > 0
            ? data.map((productData, index) => (
                <ProductCard
                  key={index}
                  {...{ productData, setVariantModal, onUpdate }}
                />
              ))
            : !loader && (
                <div>
                  <img src={Product_list_empty} alt="empty" />
                  <div style={{ color: "#727176", marginLeft: 60 }}>
                    There are no products here
                  </div>
                </div>
              )}
        </div>
      </InfiniteScroll>
      <AddToCartWithVariants
        {...variantModal}
        {...{ onUpdate }}
        onClose={() => {
          setVariantModal(constants.defaultVariantModal);
        }}
      />
    </div>
  );
};

const ProductCard = ({ productData, setVariantModal, onUpdate }) => {
  // Open the modal for packaging and pricing modal
  const [openPricingModal, setOpenPricingModal] = useState({
    open: false,
    id: null,
  });

  const [openPkgModal, setOpenPkgModal] = useState({
    open: false,
    id: null,
  });

  let { qty, packaging_unit } = cartService.fetchCartItem(productData.id) || {};
  let item = {
    ...productData,
    qty,
    packaging_unit,
  };

  return (
    <div className={styles.product_card} id="scrollableDiv">
      <div className={styles.img}>
        <img
          src={item.display_pic_url ? item.display_pic_url : NoPhoto}
          alt="product"
          style={item.is_out_of_stock ? { filter: "grayscale(1)" } : {}}
        />
      </div>
      <div className={styles.code}>{item.code}</div>
      <div>
        <div className={styles.name} style={{ marginBottom: 0 }}>
          {item.name.replace(item?.variant_name, "")}
        </div>
        <div
          style={{
            paddingInline: "5px",
            color: "#727176",
            fontWeight: 600,
          }}
        >
          {item?.variant_name}
        </div>
      </div>
      <div className={styles.mrp}>
        MRP : {toIndianCurrency(item.mrp_price, 4)} / {item.mrp_unit}
      </div>
      <div className={styles.buyer}>
        <div>
          {toIndianCurrency(buyerPriceWithTelescope(item), 4)}
          <span style={{ color: "#727176" }}> / {item.unit}</span>
        </div>
        {item.telescope_pricing?.length > 0 ? (
          <span
            onMouseOver={() =>
              setOpenPricingModal({
                open: true,
                id: productData.id,
              })
            }
            onMouseLeave={() =>
              setOpenPricingModal({
                open: false,
                id: null,
              })
            }
            style={{ cursor: "pointer" }}
          >
            Price Slab{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.20065 4.85967C8.33398 4.73967 8.49398 4.66634 8.66732 4.66634C8.84732 4.66634 9.00065 4.73967 9.14065 4.85967C9.26732 4.99967 9.33398 5.15967 9.33398 5.33301C9.33398 5.51301 9.26732 5.66634 9.14065 5.80634C9.00065 5.93301 8.84732 5.99967 8.66732 5.99967C8.49398 5.99967 8.33398 5.93301 8.20065 5.80634C8.07398 5.66634 8.00065 5.51301 8.00065 5.33301C8.00065 5.15967 8.07398 4.99967 8.20065 4.85967ZM6.53398 7.97967C6.53398 7.97967 7.98065 6.83301 8.50732 6.78634C9.00065 6.74634 8.90065 7.31301 8.85398 7.60634L8.84732 7.64634C8.75398 7.99967 8.64065 8.42634 8.52732 8.83301C8.27398 9.75967 8.02732 10.6663 8.08732 10.833C8.15398 11.0597 8.56732 10.773 8.86732 10.573C8.90732 10.5463 8.94065 10.5197 8.97398 10.4997C8.97398 10.4997 9.02732 10.4463 9.08065 10.5197C9.09398 10.5397 9.10732 10.5597 9.12065 10.573C9.18065 10.6663 9.21398 10.6997 9.13398 10.753L9.10732 10.7663C8.96065 10.8663 8.33398 11.3063 8.08065 11.4663C7.80732 11.6463 6.76065 12.2463 6.92065 11.0797C7.06065 10.2597 7.24732 9.55301 7.39398 8.99967C7.66732 7.99967 7.78732 7.54634 7.17398 7.93967C6.92732 8.08634 6.78065 8.17967 6.69398 8.23967C6.62065 8.29301 6.61398 8.29301 6.56732 8.20634L6.54732 8.16634L6.51398 8.11301C6.46732 8.04634 6.46732 8.03967 6.53398 7.97967ZM14.6673 7.99967C14.6673 11.6663 11.6673 14.6663 8.00065 14.6663C4.33398 14.6663 1.33398 11.6663 1.33398 7.99967C1.33398 4.33301 4.33398 1.33301 8.00065 1.33301C11.6673 1.33301 14.6673 4.33301 14.6673 7.99967ZM13.334 7.99967C13.334 5.05301 10.9473 2.66634 8.00065 2.66634C5.05398 2.66634 2.66732 5.05301 2.66732 7.99967C2.66732 10.9463 5.05398 13.333 8.00065 13.333C10.9473 13.333 13.334 10.9463 13.334 7.99967Z"
                fill="#727176"
              />
            </svg>
            <ul
              className={`${styles.card_dropdown_price} ${
                openPricingModal.open && openPricingModal.id === productData.id
                  ? styles.active_dropdown_price
                  : ""
              }`}
              onMouseOver={() =>
                setOpenPricingModal({
                  open: true,
                  id: productData.id,
                })
              }
              onMouseLeave={() =>
                setOpenPricingModal({
                  open: false,
                  id: null,
                })
              }
            >
              {item.telescope_pricing?.map((ele, ind) => (
                <li key={ind}>
                  <span style={{ color: "#727176" }}>
                    Minimum Order : {ele.qty}
                  </span>
                  <span>{toIndianCurrency(ele.price, 4)}</span>
                </li>
              ))}
            </ul>
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.gst}>
        <div>
          {item.gst_exclusive
            ? `(GST ${item.gst}% extra)`
            : `(GST ${item.gst}% incl.)`}
        </div>
        <span
          onMouseOver={() =>
            setOpenPkgModal({
              open: true,
              id: productData.id,
            })
          }
          onMouseLeave={() =>
            setOpenPkgModal({
              open: false,
              id: null,
            })
          }
          style={{ cursor: "pointer" }}
        >
          {" "}
          Pkg Level{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.20065 4.85967C8.33398 4.73967 8.49398 4.66634 8.66732 4.66634C8.84732 4.66634 9.00065 4.73967 9.14065 4.85967C9.26732 4.99967 9.33398 5.15967 9.33398 5.33301C9.33398 5.51301 9.26732 5.66634 9.14065 5.80634C9.00065 5.93301 8.84732 5.99967 8.66732 5.99967C8.49398 5.99967 8.33398 5.93301 8.20065 5.80634C8.07398 5.66634 8.00065 5.51301 8.00065 5.33301C8.00065 5.15967 8.07398 4.99967 8.20065 4.85967ZM6.53398 7.97967C6.53398 7.97967 7.98065 6.83301 8.50732 6.78634C9.00065 6.74634 8.90065 7.31301 8.85398 7.60634L8.84732 7.64634C8.75398 7.99967 8.64065 8.42634 8.52732 8.83301C8.27398 9.75967 8.02732 10.6663 8.08732 10.833C8.15398 11.0597 8.56732 10.773 8.86732 10.573C8.90732 10.5463 8.94065 10.5197 8.97398 10.4997C8.97398 10.4997 9.02732 10.4463 9.08065 10.5197C9.09398 10.5397 9.10732 10.5597 9.12065 10.573C9.18065 10.6663 9.21398 10.6997 9.13398 10.753L9.10732 10.7663C8.96065 10.8663 8.33398 11.3063 8.08065 11.4663C7.80732 11.6463 6.76065 12.2463 6.92065 11.0797C7.06065 10.2597 7.24732 9.55301 7.39398 8.99967C7.66732 7.99967 7.78732 7.54634 7.17398 7.93967C6.92732 8.08634 6.78065 8.17967 6.69398 8.23967C6.62065 8.29301 6.61398 8.29301 6.56732 8.20634L6.54732 8.16634L6.51398 8.11301C6.46732 8.04634 6.46732 8.03967 6.53398 7.97967ZM14.6673 7.99967C14.6673 11.6663 11.6673 14.6663 8.00065 14.6663C4.33398 14.6663 1.33398 11.6663 1.33398 7.99967C1.33398 4.33301 4.33398 1.33301 8.00065 1.33301C11.6673 1.33301 14.6673 4.33301 14.6673 7.99967ZM13.334 7.99967C13.334 5.05301 10.9473 2.66634 8.00065 2.66634C5.05398 2.66634 2.66732 5.05301 2.66732 7.99967C2.66732 10.9463 5.05398 13.333 8.00065 13.333C10.9473 13.333 13.334 10.9463 13.334 7.99967Z"
              fill="#727176"
            />
          </svg>
          <ul
            className={`${styles.card_dropdown_pkg} ${
              openPkgModal.open && openPkgModal.id === productData.id
                ? styles.active_dropdown_pkg
                : ""
            }`}
            onMouseOver={() =>
              setOpenPkgModal({
                open: true,
                id: productData.id,
              })
            }
            onMouseLeave={() =>
              setOpenPkgModal({
                open: false,
                id: null,
              })
            }
          >
            {item.packaging_level?.map((ele, ind) => (
              <li key={ind}>
                <span>
                  {ele.size} x {item.unit} :{" "}
                </span>
                <span style={{ marginLeft: 20 }}>{ele.unit}</span>
              </li>
            ))}
          </ul>
        </span>
      </div>
      <div className={styles.add_to_cart_button}>
        <AddToCartButton {...{ item, setVariantModal }} {...{ onUpdate }} />
      </div>
      <div className={styles.variant_display}>
        {!!variantAddedCount(productData) && (
          <>{variantAddedCount(productData)} variants added</>
        )}
      </div>
    </div>
  );
};

export default ProductCardView;

export const variantAddedCount = (productData) => {
  let variantNameList = cartService
    .fetchCart()
    .filter((product) => product.primary_product)
    .map((product) => product.primary_product);
  return variantNameList.filter((name) => name === productData.primary_product)
    .length;
};
