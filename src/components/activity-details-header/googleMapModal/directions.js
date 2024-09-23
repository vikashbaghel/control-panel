import React, { useEffect, useState } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  Polyline,
} from "@react-google-maps/api";

const Directions = ({ data }) => {
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [response, setResponse] = useState(null);
  const [callbackPermission, setCallbackPermission] = useState(false);
  const [ployLineRoute, setPloyLineRoute] = useState(false);

  const directionsCallback = (result, status) => {
    if (callbackPermission) {
      if (status === "OK") {
        setResponse(JSON.parse(JSON.stringify(result)));
      } else {
        console.error(`Directions request failed due to ${status}`);
        setPloyLineRoute(true);
      }
      setCallbackPermission(false);
    }
  };

  useEffect(() => {
    data.length > 0 && setCallbackPermission(true);
  }, [data]);

  return (
    <>
      {response && (
        <DirectionsRenderer
          directions={response}
          options={{
            polylineOptions: {
              strokeColor: "#322E80",
              strokeOpacity: 1,
              strokeWeight: 6,
            },
            suppressMarkers: true,
          }}
        />
      )}
      {ployLineRoute && (
        <Polyline
          options={{
            path: data,
            strokeColor: "#322E80",
            strokeOpacity: 1,
            strokeWeight: 6,
          }}
        />
      )}
      <DirectionsService
        options={{
          destination: data[data.length - 1],
          origin: data[0],
          waypoints: data.map((stop) => ({ location: stop })),
          travelMode: travelMode,
        }}
        callback={directionsCallback}
      />
    </>
  );
};

export default Directions;
