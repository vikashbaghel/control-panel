import React, { useContext, useEffect, useState } from "react";
import { Modal } from "antd";
import { GEO_ALERT, GEO_LOCATION } from "../../assets/images";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import styles from "./geoLocationFencing.module.css";
import Cookies from "universal-cookie";
import Context from "../../context/Context";
import { INITIAL_GEO_LOCATION_ACTION } from "../../generic/contextConstant";
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import SessionExpireError from "../../helpers/sessionExpireError";
import { MapPin } from "../../assets";

const cookies = new Cookies();

const GeoLocationFencing = () => {
  const context = useContext(Context);
  const { geoLocationAction, setGeoLocationAction } = context;
  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360";
  const [customerName, setCustomerName] = useState("");

  const enableGeoFencing =
    cookies.get("rupyzEnableGeoFencing") === "true" ? true : false;
  const isTelephonicOrder =
    cookies.get("telephonic_order") === "true" ? true : false;

  const [openGeoLocationModal, setOpenGeoLocationModal] = useState(false);
  const [openLocationAlert, setOpenLocationAlert] = useState(false);

  const onCloseGeoFenctionModal = () => {
    setOpenGeoLocationModal(false);
    geoLocationAction.handleAction && geoLocationAction.handleAction();
    onEmptyHandler();
  };

  const onCloseLocationModal = () => {
    setOpenLocationAlert(false);
    geoLocationAction.handleAction && geoLocationAction.handleAction();
    onEmptyHandler();
  };

  const getCurrentPosition = async (value) => {
    if (
      !enableGeoFencing ||
      openGeoLocationModal ||
      value.lat === 0 ||
      admin ||
      isTelephonicOrder
    ) {
      setOpenGeoLocationModal(false);
      return;
    }

    await navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(function (position) {
            const distance = calculateDistance(
              `${position.coords.latitude}`,
              `${position.coords.longitude}`,
              value.lat,
              value.lng
            );
            // distance is in meters
            if (distance <= 150) {
              setOpenGeoLocationModal(false);
            } else {
              setOpenGeoLocationModal(true);
            }
          });
          return;
        }
        setOpenLocationAlert(true);
        setOpenGeoLocationModal(false);
      });
  };

  useEffect(() => {
    geoLocationAction.customer_id &&
      getCustomerDetail(geoLocationAction.customer_id).then((response) => {
        getCurrentPosition({
          lat: response.data.data.map_location_lat,
          lng: response.data.data.map_location_long,
        });
        setCustomerName(response.data.data.name);
      });
  }, [geoLocationAction]);

  const onEmptyHandler = () => {
    setGeoLocationAction(INITIAL_GEO_LOCATION_ACTION);
  };

  return (
    <>
      <Modal
        width={520}
        onCancel={onCloseLocationModal}
        open={openLocationAlert}
        centered
        zIndex={9999}
        title={
          <div>
            <div
              style={{
                padding: 15,
                fontSize: 18,
                fontWeight: 600,
                display: "flex",
                alignContent: "center",
                gap: 20,
              }}
            >
              <img src={GEO_LOCATION} alt="alert" /> Location Permission
            </div>
            <div style={{ padding: 20, paddingTop: 0 }}>
              <div className={styles.modal_para}>
                We need this permission for the location intelligence, that
                helps you report activities to your organisation.
              </div>
              <div className={styles.modal_note}>
                Note: You can go to <strong>Browser Setting</strong> to Enable
                <strong> Location</strong>.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                padding: 20,
                gap: 20,
                alignItems: "center",
              }}
            >
              <button
                className={"button_primary"}
                onClick={onCloseLocationModal}
              >
                Ok, I'll Enable Location
              </button>
              <button
                className={"button_secondary"}
                onClick={() => {
                  setOpenGeoLocationModal(false);
                  setOpenLocationAlert(false);
                  onEmptyHandler();
                }}
              >
                Continue Without Location
              </button>
            </div>
          </div>
        }
        footer={[]}
      ></Modal>
      <Modal
        width={520}
        onCancel={onCloseGeoFenctionModal}
        open={openGeoLocationModal}
        centered
        zIndex={9999}
        title={
          <div style={{ fontFamily: "Poppins" }}>
            <div
              style={{
                padding: 15,
                fontSize: 20,
                fontWeight: 600,
                display: "flex",
                alignContent: "center",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <img src={GEO_ALERT} alt="alert" /> Alert !!
            </div>
            <div style={{ padding: 20, paddingTop: 0 }}>
              <div className={styles.modal_para}>
                Your are not in the geo fencing area
              </div>
              <div className={styles.modal_note}>
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontWeight: 600,
                    margin: 0,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                >
                  <img src={MapPin} alt="map" />
                  {customerName}
                </h2>
                <div
                  style={{
                    marginLeft: 30,
                    color: "#727176",
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                >
                  You are currently outside the 100-meter radius of this
                  customer's geolocation.
                </div>
              </div>
              <button
                className="button_primary"
                onClick={onCloseGeoFenctionModal}
                style={{ width: "100%" }}
              >
                OK
              </button>
            </div>
          </div>
        }
        footer={[]}
      ></Modal>
    </>
  );
};

export default GeoLocationFencing;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Difference in latitude
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Difference in longitude

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return roundToDecimalPlaces(distance * 1000);
}

const getCustomerDetail = async (id) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};
