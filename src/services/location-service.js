import { Space, notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const getGeoLocationAndAddress = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
    );
    let address = null;
    if (response.data.results.length > 0) {
      address = response.data.results[0].formatted_address;
    }
    return {
      lat: latitude,
      lng: longitude,
      address: address,
    };
  } catch (error) {
    console.error("Error getting geolocation or address:", error);
    return {
      message: "Error getting geolocation and address",
    };
  }
};
