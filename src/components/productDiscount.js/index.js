import { notification, Radio } from "antd";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../views/cart/cart.module.css";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { EditIcon } from "../../assets/globle";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { decimalInputValidation } from "../../helpers/regex";
import {
  buyerPriceWithTelescope,
  cartConstants,
} from "../../services/cart-service";

const getDefaultStates = (data = {}) => {
  if (Object.keys(data.discount_details || {}).length) {
    const { type, value } = data.discount_details;
    switch (type) {
      case "AMOUNT":
        return {
          offer: "discount",
          discount: value,
          discountType: "AMOUNT",
        };
      case "PERCENT":
        return {
          offer: "discount",
          discount: value,
          discountType: "PERCENT",
        };
      default:
        return {
          offer: "offer",
          offerPrice: value,
          discountType: "AMOUNT",
        };
    }
  } else
    return {
      offer: "",
      discount: "",
      discountType: "PERCENT",
    };
};

const ProductDiscount = ({ data, onUpdate }) => {
  const defaultStates = getDefaultStates(data);
  const [offer, setOffer] = useState(defaultStates["offer"] || "");
  const [offerPrice, setOfferPrice] = useState(
    defaultStates["offerPrice"] || ""
  );
  const [discount, setDiscount] = useState(defaultStates["discount"] || "");
  const [discountType, setDiscountType] = useState(
    defaultStates["discountType"] || ""
  );

  const openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: "Error",
      description: msg,
    });
  };

  const applyAmount = (data) => {
    if (discount && discountType) {
      const price = buyerPriceWithTelescope(data);
      switch (discountType) {
        case "AMOUNT":
          if (discount > price) {
            openNotificationWithIcon(
              "error",
              "Discount cannot be more than Buyer price."
            );
            return;
          }
          onUpdate({
            ...data,
            productDiscount: roundToDecimalPlaces(
              parseFloat(price - discount),
              4
            ),
            discount_value: roundToDecimalPlaces(parseFloat(discount), 4),
            discount_details: {
              type: "AMOUNT",
              value: roundToDecimalPlaces(parseFloat(discount), 4),
            },
          });
          break;
        case "PERCENT":
          let percentAmount = (discount / 100) * price;
          if (percentAmount >= price) {
            openNotificationWithIcon(
              "error",
              "Discount cannot be more than Buyer price."
            );
            return;
          }
          onUpdate({
            ...data,
            productDiscount: roundToDecimalPlaces(
              parseFloat(price - percentAmount),
              4
            ),
            discount_value: roundToDecimalPlaces(parseFloat(percentAmount), 4),
            discount_details: {
              type: "PERCENT",
              value: roundToDecimalPlaces(parseFloat(discount), 4),
            },
          });
          break;
        default:
          break;
      }
    }
  };

  const applyOfferPrice = (data) => {
    if (offerPrice) {
      const price = buyerPriceWithTelescope(data);
      onUpdate({
        ...data,
        productDiscount: roundToDecimalPlaces(parseFloat(offerPrice), 4),
        discount_value: roundToDecimalPlaces(parseFloat(price - offerPrice), 4),
        discount_details: {
          type: "OFFER_PRICE",
          value: roundToDecimalPlaces(parseFloat(offerPrice), 4),
        },
      });
    }
  };

  const actions = {
    discount: applyAmount,
    offer: applyOfferPrice,
  };

  const handleRemove = (data) => {
    onUpdate({
      ...data,
      ...cartConstants.defaultDiscountDetails,
    });
  };

  return (
    <div>
      <form>
        {data.productDiscount === undefined || data.productDiscount === 0 ? (
          <>
            <div>
              <Radio.Group
                name="radiogroup"
                onChange={(e) => {
                  if (data.productDiscount > 0) {
                    notification.warning({
                      message: "Remove Applied Discount Before changing",
                    });
                    return;
                  }
                  setOffer(e.target.value);
                  setOfferPrice("");
                  setDiscount("");
                  setDiscountType("PERCENT");
                }}
                value={offer}
              >
                <Radio
                  value={"discount"}
                  style={{
                    color: offer === "discount" ? "#322E80" : "#727176",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                  }}
                >
                  Discount
                </Radio>
                <Radio
                  value={"offer"}
                  style={{
                    color: offer === "offer" ? "#322E80" : "#727176",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                  }}
                >
                  Offer Price
                </Radio>
              </Radio.Group>
            </div>
            {offer && (
              <div className={styles.discount_section}>
                {offer === "discount" ? (
                  <div style={{ display: "flex" }}>
                    <input
                      style={{ marginRight: 20, fontFamily: "Poppins" }}
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="Enter Discount"
                      onKeyPress={(e) =>
                        decimalInputValidation(e, {
                          decimalPlaces: discountType === "PERCENT" ? 2 : 4,
                          type: discountType === "PERCENT" ? "discount" : "",
                        })
                      }
                    />
                    <select
                      style={{
                        width: "100%",
                        fontFamily: "Poppins",
                      }}
                      value={discountType}
                      onChange={(e) => {
                        setDiscount("");
                        setDiscountType(e.target.value);
                      }}
                    >
                      <option value="PERCENT">%</option>
                      <option value="AMOUNT">₹</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <input
                      style={{ fontFamily: "Poppins" }}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter Offer Price"
                      onKeyPress={(e) =>
                        decimalInputValidation(e, { decimalPlaces: 4 })
                      }
                    />
                  </div>
                )}
                <button
                  className="add_button clickable"
                  style={{
                    marginLeft: 20,
                    fontSize: 14,
                    cursor: "pointer",
                    padding: "6px 10px ",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    actions[offer](data);
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.discount_section_success}>
            <span style={{ marginRight: 6, color: "#727176" }}>
              {offer === "discount" ? " Discount : " : " Offer Price : "}{" "}
              {toIndianCurrency(
                offer === "discount"
                  ? data.discount_value
                  : data.productDiscount,
                4
              )}
            </span>
            <img
              src={EditIcon}
              alt="edit"
              onClick={() => handleRemove(data)}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductDiscount;
