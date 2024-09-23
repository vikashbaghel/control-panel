import React, { useContext, useEffect, useState } from "react";
import { Card, Col } from "antd";
import { Content } from "antd/es/layout/layout";
import Context from "../../context/Context";
import styles from "./cart.module.css";
import ProductSummary from "../../components/card/productSummary";
import ProductView from "../../components/viewDrawer/productView";
import { useNavigate } from "react-router";
import ProductDiscount from "../../components/productDiscount.js";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import Cookies from "universal-cookie";
import { ArrowLeft, DeleteCrossIcon } from "../../assets/globle";
import { CartBag, NoPhoto } from "../../assets";
import emptyCartIcon from "../../assets/emptyCart.svg";
import WrapText from "../../components/wrapText.js";
import cartService, {
  calculateGST,
  buyerPriceWithTelescope,
  cartConstants,
} from "../../services/cart-service.js";
import AddToCartButton from "../../components/addToCartButton/index.js";

const Cart = () => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setCartNumber } = context;

  const cartDetails = cartService.getCartDetails();
  const { orderId, distributor } = cartDetails;
  const updateDetails = (obj) => {
    cartService.updateCartDetails(obj);
  };

  const [cartData, setCartData] = useState(
    orderId ? [] : [...cartService.fetchCart()]
  );
  const onUpdate = (obj) => {
    cartService.updateCartItem(obj);
  };

  useEffect(() => {
    cartService.setEventListner((cartItems) => {
      setCartData([...cartItems]);
      setCartNumber((cartItems || []).length);
    });
  }, []);

  return (
    <div>
      <h4
        className="page_title"
        style={{ display: "flex", alignContent: "center", fontSize: 20 }}
      >
        {" "}
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => {
            cartData.length
              ? navigate(
                  `/web/distributor/product-list?id=${distributor?.id}&name=${distributor?.name}`
                )
              : navigate(-1);
          }}
          style={{ cursor: "pointer" }}
        />
        &nbsp; Review
      </h4>
      <Col style={{ padding: "20px 30px" }}>
        {!!cartData?.length && (
          <div className={styles.cart_container_header}>
            <img src={CartBag} alt="bag" width={40} />
            <div>
              <div>
                You have {cartData ? cartData.length : 0} items in your cart!
              </div>
              <div>
                <WrapText width={350}>{distributor?.name}</WrapText>
              </div>
            </div>
          </div>
        )}
        {cartData?.length > 0 ? (
          <CartReview {...{ cartData, onUpdate, cartDetails, updateDetails }} />
        ) : (
          <div className={styles.empty_cart}>
            <img src={emptyCartIcon} alt="empty cart" />
            <p style={{ fontSize: "26px", fontWeight: 500 }}>Cart is Empty</p>
            <p style={{ paddingBlockEnd: "2em" }}>
              Add product in your Customers cart
            </p>
            <div
              className="button_primary"
              onClick={() => navigate("/web/customer")}
            >
              Customer List
            </div>
          </div>
        )}
      </Col>
    </div>
  );
};

export const CartReview = ({
  cartData,
  onUpdate,
  cartDetails,
  updateDetails,
}) => {
  const cartSummary = {
    ...cartConstants.defaultSummaryDetails,
  };

  const handleRemove = (id) => {
    onUpdate({ id, qty: 0 });
  };

  return (
    <div className={styles.cart_container}>
      <div className={styles.product_list_conatiner}>
        <div className={styles.cart_product_table}>
          <br />
          <Content>
            <div className={styles.product_card}>
              {cartData &&
                cartData.map((data, index) => {
                  if (index === 0) {
                    //Reset total GST and total price amounts
                    cartSummary.totalGSTAmount = 0;
                    cartSummary.totalPriceWithGstAmount = 0;
                    cartSummary.totalPriceWithoutGstAmount = 0;
                  }
                  const {
                    gst,
                    gst_exclusive,
                    qty,
                    packaging_size,
                    productDiscount,
                  } = data;
                  const { gstAmount, totalAmount } = calculateGST(
                    buyerPriceWithTelescope(
                      data,
                      data.productDiscount ? true : false
                    ),
                    gst,
                    gst_exclusive,
                    qty,
                    packaging_size
                  );
                  // Update the total GST and total price amounts
                  cartSummary.totalGSTAmount += gstAmount;
                  cartSummary.totalPriceWithGstAmount += totalAmount;
                  cartSummary.totalPriceWithoutGstAmount +=
                    totalAmount - gstAmount;

                  return (
                    <Card key={index} className={styles.card_component}>
                      <img
                        src={DeleteCrossIcon}
                        alt="delete"
                        className={styles.close_button}
                        onClick={() => handleRemove(data.id)}
                      />
                      <div className={styles.card_body}>
                        <div className={styles.heading}>
                          <img
                            src={
                              data.display_pic_url
                                ? data.display_pic_url
                                : NoPhoto
                            }
                          />
                          <div>
                            <div style={{ fontSize: 12, color: "#727176" }}>
                              {data?.code}
                            </div>
                            <div
                              style={{
                                fontSize: 18,
                                fontWeight: 600,
                                fontFamily: "Poppins",
                              }}
                            >
                              <WrapText width={400}>
                                {data.name.replace(data?.variant_name, "")}
                              </WrapText>
                            </div>
                            <div
                              style={{
                                color: "#727176",
                                margin: "5px 0",
                                fontWeight: 500,
                                fontFamily: "Poppins",
                              }}
                            >
                              {data?.variant_name}
                            </div>
                            <div
                              style={{
                                fontWeight: 600,
                                marginBottom: 5,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  color: "#3e3e3ea8",
                                  width: 120,
                                }}
                              >
                                Buyer Price :{" "}
                              </div>
                              <div>
                                {toIndianCurrency(
                                  buyerPriceWithTelescope(
                                    data,
                                    data.productDiscount ? true : false
                                  ),
                                  4
                                )}
                              </div>
                              &nbsp;
                              {!!data.productDiscount && (
                                <span
                                  style={{
                                    color: "#8b8b8b",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {toIndianCurrency(
                                    buyerPriceWithTelescope(data),
                                    4
                                  )}
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                color: "#3e3e3ea8",
                                fontSize: 12,
                                fontWeight: 600,
                                marginBottom: 5,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ width: 120 }}>Quantity : </div>
                              <div style={{ color: "black" }}>
                                {parseFloat(
                                  parseFloat(
                                    data.packaging_size * data.qty
                                  ).toFixed(2)
                                )}{" "}
                                x {data.unit}
                              </div>
                            </div>
                            <div
                              style={{
                                color: "#3e3e3ea8",
                                fontSize: 12,
                                fontWeight: 600,
                                marginBottom: 5,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ width: 120 }}>
                                GST {data.gst}%{" "}
                                {data.gst_exclusive ? "Extra " : "Incl "}:{" "}
                              </div>
                              <div style={{ color: "black" }}>
                                {toIndianCurrency(
                                  calculateGST(
                                    buyerPriceWithTelescope(
                                      data,
                                      data.productDiscount ? true : false
                                    ),
                                    data.gst,
                                    data.gst_exclusive
                                  ).gstAmount,
                                  4
                                )}{" "}
                                ({data.gst}%)
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.heading_aside}>
                          <div>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 400,
                                color: "#3e3e3ea8",
                              }}
                            >
                              Total Amount with GST :{" "}
                            </span>
                            {toIndianCurrency(totalAmount, 4)}
                          </div>
                          <div className={styles.add_cart}>
                            <AddToCartButton
                              key={data.id}
                              item={data}
                              {...{ onUpdate }}
                            />
                          </div>
                        </div>
                      </div>
                      <ProductDiscount
                        data={data}
                        key={data.id}
                        {...{ onUpdate }}
                      />
                    </Card>
                  );
                })}
            </div>
          </Content>
        </div>
      </div>
      <div className={styles.cart_product_summary}>
        <ProductSummary
          {...{ cartData, cartSummary, cartDetails, updateDetails }}
        />
      </div>
      <ProductView />
    </div>
  );
};

export default Cart;
