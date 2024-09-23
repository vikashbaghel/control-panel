import styles from "./styles.module.css";
import mapPin from "../../../assets/map-pin.svg";
import getValidAddress from "../../../helpers/validateAddress";

export default function Address({ data, mapPinImg = false }) {
  return (
    <a
      href={
        data?.map_location_lat && data?.map_location_long
          ? `https://maps.google.com/?q=${data?.map_location_lat},${data?.map_location_long}`
          : ""
      }
      onClick={(e) => {
        if (!data?.map_location_lat || !data?.map_location_long) {
          e.preventDefault();
        }
      }}
      target="_blank"
      rel="noreferrer noopener"
      style={
        data?.map_location_lat && data?.map_location_long
          ? { textDecoration: "underline" }
          : { color: "#727176", cursor: "auto" }
      }
      className={styles.customer_address}
    >
      {mapPinImg && <img src={mapPin} alt="pin" />}
      <span>{getValidAddress(data)}</span>
    </a>
  );
}
