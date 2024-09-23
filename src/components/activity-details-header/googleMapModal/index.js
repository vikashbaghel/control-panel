import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Modal from "antd/es/modal/Modal";
import Person from "../../../assets/map-person.png";
import StartPoint from "../../../assets/map-start-point.png";
import Directions from "./directions";

const GoogleMapModal = ({ action, setAction }) => {
  const { open, data, type } = action;
  const [loading, setLoading] = useState(true);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const onClose = () => {
    setAction({ open: false, data: [], type: null });
    setLoading(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [open]);

  return (
    <Modal open={open} onCancel={onClose} footer={[]} centered width={800}>
      {data.length === 0 ? (
        <div
          style={{ height: "550px", textAlign: "center", position: "relative" }}
        >
          {loading ? (
            <>
              <div style={{ marginTop: "30%" }}>
                <span style={{ fontSize: 30, fontWeight: 500 }}>
                  Loading...
                </span>
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#000",
                background: "#fff",
                padding: "20px 0",
                position: "absolute",
                width: "100%",
                marginTop: "27%",
              }}
            >
              No Data Available for {tag[type]}
            </div>
          )}
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={data[data.length - 1]}
          zoom={10}
          options={mapOptions}
        >
          {type === "activity" ? (
            data?.map((stop, index) => (
              <Marker
                key={index}
                position={stop}
                onRedDraw={false}
                label={{ text: `${index + 1}`, color: "#fff" }}
                title={stop.title}
              />
            ))
          ) : (
            <>
              <Marker
                position={data[0]}
                onRedDraw={false}
                icon={{
                  url: StartPoint,
                }}
                title="Start Point"
              />
              {data.length > 1 && (
                <Marker
                  position={data[data.length - 1]}
                  onRedDraw={false}
                  icon={{
                    url: Person,
                  }}
                  title="Current"
                />
              )}
            </>
          )}{" "}
          {data.length > 1 && type === "live" && (
            <Directions {...{ data, type }} />
          )}
        </GoogleMap>
      )}
    </Modal>
  );
};

export default GoogleMapModal;

const containerStyle = {
  width: "100%",
  height: "550px",
  border: "2px solid #EEE",
  borderRadius: 10,
};
const tag = { activity: "Activity Map", live: "Live Location" };
