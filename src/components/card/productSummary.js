import { List, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import {
  decimalInputValidation,
  numberAlphabetValidation,
} from "../../helpers/regex";
import { DeleteOutlineIcon } from "../../assets/globle";
import styles from "./productSummary.module.css";
import WrapText from "../wrapText";
import { cartCalculations } from "../../services/cart-service";
import formService from "../../services/form-service";

const constants = {
  formId: "CHECKOUT_FORM",
};

const ProductSummary = ({
  cartData,
  cartSummary,
  cartDetails,
  updateDetails,
}) => {
  const navigate = useNavigate();

  const { distributor } = cartDetails;

  const initialInput = { name: "", amount: "" };
  const initialOtherCharges = { name: "", amount: "" };
  const [formInput, setFormInput] = useState(initialInput);
  const [otherCharges, setOtherCharges] = useState(initialInput);

  const [otherChargesList, setOtherChargesList] = useState([
    ...(cartDetails.otherChargesList || []),
  ]);
  const [discountList, setDiscountList] = useState([
    ...(cartDetails.discountList || []),
  ]);
  const [cartSummaryData, setCartSummaryData] = useState({ ...cartSummary });

  const [type, setType] = useState("AMOUNT");
  const [error, setError] = useState([]);

  const handleChange = (e) => {
    setFormInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const errorHandler = (index) => {
    const err = [];
    err[index] = "Total amount cannot be negative";
    setError(err);
    setTimeout(() => {
      setError([]);
    }, 3000);
  };

  // for Other changes inputed properties
  const handleOtherCharges = (e) => {
    if (e.target.name === "amount") {
      setOtherCharges((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
        };
      });
      return;
    }
    setOtherCharges((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmitDiscount = (e) => {
    e.preventDefault();
    const successHandler = () => {
      setDiscountList([
        ...discountList,
        {
          name: formInput.name,
          value: Math.round(formInput.amount * 100) / 100,
          type: type,
        },
      ]);
      setFormInput(initialInput);
      setType("AMOUNT");
    };

    const isValidAmount = cartCalculations(
      cartSummary.totalPriceWithoutGstAmount,
      {
        discountList: [
          ...discountList,
          {
            name: formInput.name,
            value: Math.round(formInput.amount * 100) / 100,
            type: type,
          },
        ],
        otherChargesList,
      }
    );

    if (isValidAmount.totalPriceWithGstAmount <= 0) return errorHandler(0);

    if (formInput.name && formInput.amount && type) {
      if (type === "AMOUNT") {
        if (
          cartSummaryData.totalPriceWithoutGstAmount -
            Number(formInput.amount) >
          0
        ) {
          return successHandler();
        }
        return errorHandler(0);
      }
      if (type === "PERCENT") {
        let perAmount =
          (parseInt(formInput.amount) / 100) *
          cartSummaryData.totalPriceWithoutGstAmount;
        if (
          parseFloat(cartSummaryData.totalPriceWithoutGstAmount) - perAmount >
          0
        ) {
          return successHandler();
        }
        return errorHandler(0);
      }
    }
    notification.warning({ message: "Please Enter Discount Before Adding" });
  };

  const handleSubmitOtherCharges = () => {
    if (!otherCharges.name || !otherCharges.amount) {
      notification.warning({
        message: "Please Enter Other Charge Before Adding",
      });
      return;
    }

    if (
      Number(otherCharges.amount) + cartSummaryData.totalPriceWithGstAmount <=
      0
    )
      return errorHandler(1);

    setOtherChargesList((prev) => [
      ...prev,
      {
        name: otherCharges.name,
        value: Number(otherCharges.amount),
      },
    ]);
    setOtherCharges(initialOtherCharges);
  };

  const handleChargesRemove = (item) => {
    let tempChargeList = [...otherChargesList].filter((data) => data !== item);
    setOtherChargesList(tempChargeList);
  };

  const handleDiscountRemove = (item) => {
    let remainingList = [...discountList].filter((data) => data !== item);
    setDiscountList(remainingList);
  };

  const handleCheckout = () => {
    if (
      cartData &&
      cartData
        .map((data) => data.qty)
        .filter((qty) => qty === null || qty === undefined || qty === 0)
        .length > 0
    ) {
      notification.warning({
        message: "Quantity can not be less than 1",
      });
      return;
    } else {
      localStorage.setItem(
        "payment-details",
        JSON.stringify({
          cartDetails: {
            ...cartDetails,
            distributor,
            discountList,
            otherChargesList,
          },
          cartData,
          totalAmount: roundToDecimalPlaces(
            cartSummaryData.totalPriceWithGstAmount
          ),
        })
      );
      navigate(`/web/order/checkout/${distributor.id}`);
    }
  };

  useEffect(() => formService.setFormValues(constants.formId, "", {}), []);

  useEffect(() => {
    setTimeout(() => {
      setCartSummaryData({
        ...cartCalculations(cartSummary.totalPriceWithoutGstAmount, {
          discountList,
          otherChargesList,
        }),
      });
    }, 0);
    updateDetails({ discountList, otherChargesList });
  }, [cartData, discountList, otherChargesList]);

  return (
    <div>
      <div className={styles.summary_container}>
        <div className={styles.summary_top}>
          <div>Order Summary</div>
          <div className={styles.list_item}>
            <p className={styles.minor_heading}>
              Order Amount <span style={{ fontSize: 12 }}>Without GST</span>
            </p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>
              {toIndianCurrency(cartSummaryData.totalPriceWithoutGstAmount)}
            </p>
          </div>
        </div>
        <div className={styles.summary_mid}>
          <div className={styles.minor_heading}>Discount (Max 5 discount) </div>
          <div style={{ color: "red" }}>{error?.[0]}</div>
          <div className={styles.list_item}>
            <input
              style={{ margin: 5 }}
              placeholder="Enter discount name"
              name="name"
              value={formInput.name}
              onChange={handleChange}
              onKeyPress={numberAlphabetValidation}
            />
          </div>
          <div className={styles.list_item}>
            <input
              className={styles.input}
              placeholder="Enter discount"
              name="amount"
              value={formInput.amount}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleChange(e);
                }
              }}
              onKeyPress={decimalInputValidation}
            />
            <select
              className={styles.input}
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="AMOUNT">Amount</option>
              <option value="PERCENT">Percent</option>
            </select>
          </div>
          <button
            className="add_button clickable"
            style={{
              float: "right",
              margin: "0px 5px",
              padding: "5px 15px ",
            }}
            onClick={handleSubmitDiscount}
            disabled={discountList.length >= 5}
          >
            Add
          </button>
          <br />
          <br />
          {discountList.length !== 0 ? (
            <List
              size="small"
              bordered
              dataSource={discountList}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {
                    <>
                      <span style={{ width: 200 }}>
                        <WrapText width={200}>{`${index + 1} - ${
                          item.name
                        }`}</WrapText>
                      </span>

                      <span style={{ fontWeight: 700 }}>
                        {item.type === "AMOUNT" ? "₹" : ""}
                        {item.value}
                        {item.type === "AMOUNT" ? "" : "%"}
                      </span>
                      <br />
                      <span
                        onClick={() => handleDiscountRemove(item)}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        <img src={DeleteOutlineIcon} alt="delete" />
                      </span>
                    </>
                  }
                </List.Item>
              )}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.summary_mid}>
          <div className={styles.minor_heading}>
            Other charges (Max 5 charges){" "}
          </div>
          <div style={{ color: "red" }}>{error?.[1]}</div>
          <div className={styles.list_item}>
            <input
              style={{ margin: 5 }}
              placeholder="Charges name"
              name="name"
              value={otherCharges.name}
              onChange={handleOtherCharges}
              onKeyPress={numberAlphabetValidation}
            />
            <input
              className={styles.input}
              placeholder="Enter charges"
              name="amount"
              value={otherCharges.amount === 0 ? "" : otherCharges.amount}
              onChange={handleOtherCharges}
              onKeyPress={(e) =>
                decimalInputValidation(e, { restrictNegative: false })
              }
            />
          </div>
          <button
            className="add_button clickable"
            style={{
              float: "right",
              margin: "0px 5px",
              padding: "5px 15px ",
            }}
            onClick={handleSubmitOtherCharges}
            disabled={otherChargesList?.length >= 5}
          >
            Add
          </button>
          <br />
          <br />
          {otherChargesList?.length !== 0 ? (
            <List
              size="small"
              bordered
              dataSource={otherChargesList}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {
                    <>
                      <span style={{ width: 200 }}>
                        <WrapText width={200}>{`${index + 1} - ${
                          item.name
                        }`}</WrapText>
                      </span>

                      <span>{item.value}</span>
                      <br />
                      <span
                        onClick={() => handleChargesRemove(item)}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        <img src={DeleteOutlineIcon} alt="delete" />
                      </span>
                    </>
                  }
                </List.Item>
              )}
            />
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 30px",
            fontSize: 15,
          }}
        >
          <span>GST Amount</span>
          <span style={{ fontWeight: 600 }}>
            {toIndianCurrency(parseFloat(cartSummaryData.totalGSTAmount))}
          </span>
        </div>
        <div className={styles.summary_end}>
          <div className={styles.list_item_total}>
            <div>Total Amount</div>
            <div style={{ width: 180, overflow: "auto", textAlign: "end" }}>
              {toIndianCurrency(cartSummaryData.totalPriceWithGstAmount)}
            </div>
          </div>
          <br />
        </div>
      </div>
      <div>
        <button
          className="button_primary"
          onClick={handleCheckout}
          style={{
            float: "right",
            marginTop: 20,
            fontSize: 15,
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProductSummary;
