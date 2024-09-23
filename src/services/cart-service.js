import Cookies from "universal-cookie";
import { roundToDecimalPlaces } from "../helpers/roundToDecimal";

const cookies = new Cookies();

export const cartConstants = {
  key: "cart-v1",
  defaultCartDetails: {
    distributor: {
      id: "",
      name: "",
    },
    discountList: [],
    otherChargesList: [],
    orderId: "",
    orderDetail: {},
  },
  defaultDiscountDetails: {
    productDiscount: 0,
    discount_value: 0,
    discount_details: {},
  },
  defaultSummaryDetails: {
    totalGSTAmount: 0,
    totalPriceWithGstAmount: 0,
    totalPriceWithoutGstAmount: 0,
  },
};

var cartstates = {
  eventListner: () => {},
};

const setEventListner = (callback) => {
  cartstates.eventListner = callback;
};

const fetchCart = () => {
  return JSON.parse(localStorage.getItem(cartConstants.key) || "[]");
};

const fetchCartItem = (id) => {
  let cartData = fetchCart();
  let index = cartData.findIndex((ele) => ele.id === id);
  if (index !== -1) {
    return cartData[index];
  } else return {};
};

const updateCartItem = (productDetails, callback) => {
  let cartData = fetchCart();
  let index = cartData.findIndex((ele) => ele.id === productDetails["id"]);
  if (index === -1) {
    if (productDetails["qty"]) {
      cartData.push({
        ...cartConstants.defaultDiscountDetails,
        ...productDetails,
      });
    }
  } else {
    if (productDetails["qty"] === 0) {
      cartData.splice(index, 1);
    } else {
      cartData[index] = {
        ...cartData[index],
        ...productDetails,
      };
    }
  }
  localStorage.setItem(cartConstants.key, JSON.stringify(cartData));
  if (callback) {
    callback(fetchCartItem(productDetails["id"]));
  }
  if (cartstates.eventListner) {
    cartstates.eventListner(cartData);
  }
};

const clearCart = () => {
  localStorage.setItem("payment-details", "{}");
  localStorage.setItem("cart-details", "{}");
  localStorage.setItem(cartConstants.key, "[]");
  if (cartstates.eventListner) {
    cartstates.eventListner([]);
  }
};

const initCart = (distributor, cartDetails = {}) => {
  clearCart();
  let { id, name, parent_name, parent_id, payment_term } = distributor;
  localStorage.setItem(
    "cart-details",
    JSON.stringify({
      distributor: { id, name, parent_name, parent_id, payment_term },
      discountList: [],
      otherChargesList: [],
      orderId: "",
      orderDetail: {},
      ...cartDetails,
    })
  );
};
const getCartDetails = () => {
  return JSON.parse(
    localStorage.getItem("cart-details") ||
      JSON.stringify(cartConstants.defaultCartDetails)
  );
};
const updateCartDetails = (cartDetails = {}) => {
  localStorage.setItem(
    "cart-details",
    JSON.stringify({
      ...getCartDetails(),
      ...cartDetails,
    })
  );
};

const cartService = {
  setEventListner,
  fetchCart,
  fetchCartItem,
  updateCartItem,
  clearCart,
  initCart,
  getCartDetails,
  updateCartDetails,
};

export default cartService;

export const calculateGST = (price, gst, gstExclusive, qty, packaging_size) => {
  if (gstExclusive) {
    const gstAmount = (price * gst) / 100;
    return qty
      ? {
          gstAmount: gstAmount * qty * packaging_size,
          totalAmount: (price + gstAmount) * qty * packaging_size,
        }
      : {
          gstAmount: gstAmount,
          totalAmount: price + gstAmount,
        };
  } else {
    const gstAmount = (price * gst) / (100 + gst);
    return qty
      ? {
          gstAmount: gstAmount * qty * packaging_size,
          totalAmount: price * qty * packaging_size,
        }
      : {
          gstAmount: gstAmount,
          totalAmount: price,
        };
  }
};

export function calculatePercentage(price, percent) {
  const percentageAmount = price * (percent / 100);
  return percentageAmount;
}

export function buyerPriceWithTelescope(product, withDiscount = false) {
  if (Object?.keys(product)?.length < 2) return;

  let price = product.price;
  const discount = product?.discount_value || 0;
  const discountedPrice = price - discount;

  if (!product.telescope_pricing.length) {
    return withDiscount ? discountedPrice : price;
  } else {
    const cartData = fetchCartItem(product.id) || {};
    if (!cartData?.id) return withDiscount ? discountedPrice : price;

    const qty = cartData.qty * (cartData.packaging_size || 1);
    product.telescope_pricing.forEach((ele) => {
      if (qty >= ele.qty) price = ele.price;
    });
    return withDiscount ? price - discount : price;
  }
}

export const calculateListDiscount = (amountWithoutGST, discountList) => {
  let totalDiscountAmount = 0;
  for (let i = 0; i < discountList.length; i++) {
    let { value, type } = discountList[i];
    switch (type) {
      case "PERCENT":
        let discountInPercent = value / 100;
        // Reduce the percentage from both ratios
        let discount = amountWithoutGST * discountInPercent;
        totalDiscountAmount += discount;
        break;
      case "AMOUNT":
        totalDiscountAmount += value;
        break;
    }
  }
  return totalDiscountAmount;
};

export const cartCalculations = (
  amountWithoutGST,
  { discountList, otherChargesList }
) => {
  //calculate total discount
  let totalDiscountAmount = calculateListDiscount(
    amountWithoutGST,
    discountList
  );
  let totalDiscountPercent = (totalDiscountAmount / amountWithoutGST) * 100;

  //discounted amount without GST
  let discountedAmountWithoutGST = Number(
    (amountWithoutGST - totalDiscountAmount).toFixed(2)
  );

  //apply total discount to each product to calculate final GST
  let discountedGSTAmount = 0;
  let items = fetchCart();
  for (let i = 0; i < items.length; i++) {
    const { productDiscount, gst, gst_exclusive, qty, packaging_size } =
      items[i];
    let price = buyerPriceWithTelescope(
      items[i],
      productDiscount ? true : false
    );
    const { gstAmount, totalAmount } = calculateGST(
      price,
      gst,
      gst_exclusive,
      qty,
      packaging_size
    );
    let discountAmount = calculatePercentage(
      totalAmount - gstAmount,
      totalDiscountPercent
    );
    let updatedPrice = totalAmount - gstAmount - discountAmount; //discounted price
    let updatedGst = calculatePercentage(updatedPrice, gst); //discounted gst
    discountedGSTAmount += updatedGst;
  }

  //return updated cart summary
  return {
    totalGSTAmount: roundToDecimalPlaces(discountedGSTAmount),
    totalPriceWithGstAmount: roundToDecimalPlaces(
      discountedAmountWithoutGST +
        discountedGSTAmount +
        otherChargesList?.reduce(
          (accumulator, current) => accumulator + current.value,
          0
        ),
      2
    ),
    totalPriceWithoutGstAmount: discountedAmountWithoutGST,
  };
};
