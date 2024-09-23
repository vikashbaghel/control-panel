import moment from "moment-timezone";
import Cookies from "universal-cookie";
import { BASE_URL_V1, org_id } from "../../config";
import axios from "axios";
import SessionExpireError from "../sessionExpireError";
import cartService, { cartConstants } from "../../services/cart-service";
import { Space, notification } from "antd";
import { isDraft } from "@reduxjs/toolkit";

const cookies = new Cookies();

export const imgFormatCheck = (url) => {
  let tempURLlist = url.split(".");
  let type = ["jpg", "png", "jpeg"].includes(
    tempURLlist[tempURLlist.length - 1]
  );
  return type;
};

export const convertToUTC = (date) => {
  const inputMoment = moment(date, "DD-MM-YYYY hh:mm A");

  // Check if the date is valid
  if (!inputMoment.isValid()) {
    console.error("Invalid date format");
    return null;
  }
  const formattedDateString = inputMoment.format("YYYY-MM-DDTHH:mm:ss");

  const dateString = new Date(formattedDateString);
  const inUTC = dateString.toUTCString();
  const formattedDate = moment
    .utc(inUTC, "ddd, DD MMM YYYY HH:mm:ss [GMT]")
    .format("YYYY-MM-DDTHH:mm:ss");

  return formattedDate;
};

export function timeZoneConversion(time, to = "IST", timezone = "IND") {
  const timeZones = {
    IND: "Asia/Kolkata",
  };

  if (to === "IST") {
    return moment
      .utc(time)
      .tz(timeZones[timezone])
      .format("DD-MMM-YYYY, hh:mm A");
  } else {
    return moment(time, "DD-MM-YYYY hh:mm A")
      .tz(timeZones[timezone])
      .utc()
      .format();
  }
}

export function removeEmpty(obj) {
  // Iterate over the keys of the object
  for (let key in obj) {
    // Check if the object has the key as its own property
    if (obj.hasOwnProperty(key)) {
      // Check if the value is empty
      if (
        obj[key] === "" ||
        obj[key] === 0 ||
        obj[key] === null ||
        obj[key] === undefined
      ) {
        // Delete the key if the value is empty
        delete obj[key];
      }
    }
  }
  return obj;
}

export const formatState = (state) => {
  let stateMap = {
    Chattisgarh: "Chhattisgarh",
    "Dadra & Nagar Haveli": "Dadra and Nagar Haveli",
    Odisha: "Orissa",
  };
  return stateMap[state] || state;
};

export const handleEditOder = async (orderDetail, callback) => {
  //get updated product details
  let response = await fetchProductList([
    ...orderDetail.items.map((item) => item.id),
  ]);
  response = response.data.map((item) => ({
    id: item.id,
    is_out_of_stock: item.is_out_of_stock,
  }));
  const updatedProducts = mergeArrays(orderDetail.items, response).map(
    (item) => ({
      ...item,
      initial_qty: item.qty,
      //set up price and discount details
      price: item.original_price,
      ...(item.discount_value
        ? {
            productDiscount: item.price - (item.discount_value || 0),
          }
        : {}),
    })
  );

  //setup cart for order edit
  cartService.initCart(orderDetail.customer, {
    discountList: orderDetail.discount_details || [],
    otherChargesList: orderDetail.charges_details || [],
    orderId: orderDetail.id,
    orderDetail: orderDetail,
    isDraft: false,
  });
  updatedProducts.map((product) => {
    cartService.updateCartItem(product);
  });

  callback && callback();
};

const fetchProductList = async (ids) => {
  const headers = { Authorization: cookies.get("rupyzToken") };
  const url = `${BASE_URL_V1}/organization/${org_id}/product/`;
  const params = { ids: ids.join(",") };
  try {
    const res = await axios.get(url, { headers, params });
    return res.data;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

const mergeArrays = (arr1, arr2) => {
  return arr1?.map((item) => {
    const matchingItem = arr2.find((sItem) => sItem.id === item.id);

    if (matchingItem) {
      return {
        ...item,
        is_out_of_stock: matchingItem.is_out_of_stock,
      };
    }

    return item;
  });
};

export const removeAllCookies = (preserve = []) => {
  let obj = {};
  preserve.map((k) => {
    obj[k] = localStorage.getItem(k);
  });
  Object.keys(cookies.getAll()).forEach((cookieName) => {
    cookies.remove(cookieName);
  });
  localStorage.clear();
  Object.keys(obj).map((k) => {
    if (obj[k]) {
      localStorage.setItem(k, obj[k]);
    }
  });
};

export const TimeInHrsAndMinsFormat = (totalMins) => {
  if (!totalMins) return "--";
  const hrs = parseInt(totalMins / 60);
  const mins = parseInt(totalMins % 60);
  if (!hrs) return mins + " mins";
  else if (!mins) return hrs + " hrs";
  else return hrs + " hrs " + mins + " mins";
};
