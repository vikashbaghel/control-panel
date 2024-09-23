import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_KEY } from "../../config";
import { useEffect, useState } from "react";
import mapPin from "../../assets/map-pin-blue.svg";
import { CloseCircleTwoTone, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./googleMap.module.css";

const constants = {
  defaultAddressDetails: {
    address_line_1: "",
    pincode: "",
    city: "",
    state: "",
  },
};

function GoogleMaps({
  title,
  marker,
  handleMarker,
  type,
  is_required = false,
}) {
  const [viewMap, setviewMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const [addressDetail, setAddressDetail] = useState({
    geo_address: marker.geo_address,
    detail: {},
    is_map_action_remove: false,
  });

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const { lat, lng } = place.geometry.location.toJSON();
        setCurrentLocation({ lat, lng });
        setMarkerPosition({ lat, lng });
        getAddressFromCoordinates(lat, lng);
      }
    }
  };

  const getAddressFromCoordinates = async (
    lat,
    lng,
    callback = setAddressDetail
  ) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;
    try {
      const response = await axios.get(URL);
      const results = response.data.results;

      if (results.length > 0) {
        const { mapLocationAddress, addressDetails } =
          fetchAddressDetails(results);
        let details = {
          init_map_location: marker.init_map_location,
          is_map_action_remove: addressDetail.is_map_action_remove,
          geo_address: mapLocationAddress,
          detail: addressDetails,
        };
        callback(details);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleMarkerForCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      setMarkerPosition({ lat: latitude, lng: longitude });

      await getAddressFromCoordinates(latitude, longitude, (details) => {
        setAddressDetail(details);
        handleMarker({
          lat: latitude,
          lng: longitude,
          init_map_location: details.init_map_location,
          geo_address: details.geo_address,
          detail: details.detail,
        });
      });
    });
  };
  const handleMarkerDragEnd = (event) => {
    // Get the updated position of the marker when it's dragged and released
    const { latLng } = event;
    setMarkerPosition({ lat: latLng.lat(), lng: latLng.lng() });
    getAddressFromCoordinates(latLng.lat(), latLng.lng());
  };

  const handleSave = async () => {
    setAddressDetail({
      ...addressDetail,
      is_map_action_remove: false,
    });

    await handleMarker({
      ...markerPosition,
      geo_address: addressDetail.geo_address,
      detail: addressDetail.detail,
      init_map_location: true,
    });
    setviewMap(false);
  };

  const handleRemove = () => {
    handleMarker({ lat: -1, lng: -1, geo_address: "", detail: {} });
    setAddressDetail({
      geo_address: "",
      detail: {},
      is_map_action_remove: true,
    });
    setviewMap(false);
  };

  useEffect(() => {
    if (viewMap) {
      const { lat, lng, geo_address } = marker;
      if (lat > 0 && lng > 0) {
        setCurrentLocation({ lat, lng });
        setMarkerPosition({ lat, lng });
        setAddressDetail((prevState) => ({
          ...prevState,
          geo_address: prevState.geo_address || geo_address,
          detail: prevState.detail,
        }));
      } else {
        handleMarkerForCurrentLocation();
      }
    }
  }, [viewMap]);

  useEffect(() => {
    if (marker.lat === 0 && type === "add") {
      handleMarkerForCurrentLocation();
    }
    if (marker.lat === -1) {
      setAddressDetail({
        ...addressDetail,
        is_map_action_remove: true,
      });
    }
  }, []);

  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: "1em" }}>
        Geo Location {title}{" "}
        {is_required && (
          <span style={{ color: "red", fontWeight: 400 }}>*</span>
        )}
      </div>
      {addressDetail.geo_address && (
        <div className={styles.link_address}>
          <a
            className={styles.customer_address}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              textDecoration: marker?.lat && marker?.lng && "underline",
            }}
            href={
              !!(marker?.lat && marker?.lng) &&
              `https://maps.google.com/?q=${marker?.lat},${marker?.lng}`
            }
          >
            {addressDetail.geo_address}
          </a>
          <div className={styles.remove_button} onClick={handleRemove}>
            Remove
          </div>
        </div>
      )}
      {viewMap ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className="search_input">
              <input
                placeholder="Search location"
                allowclear={{
                  clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
                }}
                style={{ paddingRight: 50 }}
              />
              <SearchOutlined />
            </div>
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={12}
            options={{ streetViewControl: false, mapTypeControl: false }}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1em" }}
          >
            <div
              style={{
                ...btnStyle,
                color: "#727176",
                borderColor: "rgba(238, 238, 238, 1)",
              }}
              onClick={() => {
                setAddressDetail({
                  ...addressDetail,
                  geo_address:
                    addressDetail.is_map_action_remove ||
                    (marker.lat > 0 && !marker.init_map_location)
                      ? ""
                      : marker.geo_address,
                  detail: {},
                });
                setMarkerPosition({
                  lat:
                    addressDetail.is_map_action_remove ||
                    (marker.lat > 0 && !marker.init_map_location)
                      ? -1
                      : marker.map_location_lat,
                  lng:
                    addressDetail.is_map_action_remove ||
                    (marker.lat > 0 && !marker.init_map_location)
                      ? -1
                      : marker.map_location_long,
                });

                if (
                  marker.lat > 0 &&
                  (addressDetail.is_map_action_remove ||
                    !marker.init_map_location)
                ) {
                  handleMarker({
                    lat: 0,
                    lng: 0,
                    geo_address: "",
                    detail: {},
                  });
                }
                setviewMap(false);
              }}
            >
              Cancel
            </div>
            <div
              style={{
                ...btnStyle,
                color: "#322E80",
                borderColor: "rgba(50, 46, 128, 1)",
              }}
              onClick={handleSave}
            >
              Save
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            ...locationBtn,
            ...(is_required &&
              !addressDetail.geo_address && { border: "2px solid red" }),
          }}
          onClick={() => {
            setviewMap(true);
          }}
        >
          <img src={mapPin} alt="pin" />
          {marker?.lat > 0 && marker?.lng > 0 ? "Update " : "Fetch "}
          Location
        </div>
      )}
    </div>
  );
}

export default GoogleMaps;

const containerStyle = {
  width: "100%",
  height: "250px",
  border: "2px solid #EEE",
  borderRadius: 10,
};
const btnStyle = {
  borderRadius: "5px",
  border: "2px solid",
  background: "#fff",
  padding: "10px 15px",
  cursor: "pointer",
};
const locationBtn = {
  color: "#312B81",
  display: "flex",
  justifyContent: "center",
  gap: ".5em",
  borderRadius: "5px",
  border: "2px solid #EEEEEE",
  background: "#fff",
  cursor: "pointer",
  padding: "10px 15px",
};

const fetchAddressDetails = (results) => {
  let mapLocationAddress = "";
  let addressDetails = { ...constants.defaultAddressDetails };
  let addressLine = [];

  for (let i = 0; i < results.length; i++) {
    let { address_components, formatted_address } = results[i];
    for (const component of address_components) {
      if (!addressDetails.pincode && component.types.includes("postal_code")) {
        addressDetails.pincode = component.long_name; //pincode
      }
      if (i === 0) {
        mapLocationAddress = formatted_address; //geo address
        if (
          component.types.includes("premise") ||
          component.types.includes("route") ||
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_2")
        ) {
          addressLine.push(component.long_name);
        }
      }
    }
    addressDetails.address_line_1 = addressLine.join(", ");
  }
  return { mapLocationAddress, addressDetails };
};
