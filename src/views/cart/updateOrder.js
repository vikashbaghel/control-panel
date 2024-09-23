import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import Context from "../../context/Context";
import styles from "./cart.module.css";
import { useNavigate } from "react-router";
import ProductListView from "../../components/viewDrawer/productListView";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { ArrowLeft, DeleteCrossIcon } from "../../assets/globle";
import { CartBag, NoPhoto } from "../../assets";
// import { calculateGST } from ".";
import Cookies from "universal-cookie";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import cartService, {
  buyerPriceWithTelescope,
  calculateGST,
  cartConstants,
} from "../../services/cart-service";
import WrapText from "../../components/wrapText";
import { CartReview } from ".";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const {
    setOrderViewOpen,
    setCartNumber,
    productListViewOpen,
    setProductListViewOpen,
  } = context;
  const queryParameters = new URLSearchParams(window.location.search);
  const name = queryParameters.get("name");

  const [cartData, setCartData] = useState([...cartService.fetchCart()]);
  const onUpdate = (obj) => {
    cartService.updateCartItem(obj);
  };

  const cartDetails = cartService.getCartDetails();
  const { distributor, orderId } = cartDetails;
  const updateDetails = (obj) => {
    cartService.updateCartDetails(obj);
  };

  useEffect(() => {
    cartService.setEventListner((cartItems) => {
      setCartData([...cartItems]);
    });
    setCartNumber(0);
    //remove this context and its dependencies
    setOrderViewOpen(false);
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
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        &nbsp; Update Order
      </h4>
      <Col style={{ padding: "20px 30px" }}>
        <Row
          className={styles.product_list_conatiner}
          justify={"space-between"}
          align={"bottom"}
        >
          <Col>
            <div className={styles.cart_container_header}>
              <img src={CartBag} alt="bag" width={40} />
              <div>
                <div>
                  You have {cartData ? cartData?.length : 0} items in your cart!
                </div>
                <WrapText width={350}>{name}</WrapText>
              </div>
            </div>
          </Col>
          {orderId && (
            <Col>
              <button
                className="button_primary"
                onClick={() => setProductListViewOpen(true)}
              >
                Add Product
              </button>
            </Col>
          )}
        </Row>

        {cartData?.length > 0 ? (
          <CartReview {...{ cartData, onUpdate, cartDetails, updateDetails }} />
        ) : (
          []
        )}
      </Col>
      {orderId && (
        <ProductListView
          {...{ cartData, onUpdate, cartDetails, updateDetails }}
        />
      )}
    </div>
  );
};
export default UpdateOrder;
