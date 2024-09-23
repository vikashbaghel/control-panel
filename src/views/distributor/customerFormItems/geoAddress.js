import { useEffect } from "react";
import GoogleMaps from "../../../components/googleModal/googleMap";
import { getDetailsFromPincode } from "../../../redux/action/pincodeAutoFill";

const GeoAddress = ({
  form,
  formInput,
  setFormInput,
  type,
  field_props = {},
}) => {
  const handleGeoAddress = async (addressDetails) => {
    if (addressDetails?.pincode) {
      form.setFieldsValue({
        ...addressDetails,
        ...((await getDetailsFromPincode(addressDetails?.pincode)) || {}),
      });
    }
  };

  useEffect(() => {
    setFormInput({
      ...formInput,
      is_geo_address_required: field_props.required,
    });
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <GoogleMaps
        title="Customer"
        type={type}
        is_required={field_props.required}
        marker={{
          lat: formInput.map_location_lat,
          lng: formInput.map_location_long,
          geo_address: formInput.geo_address,
          init_map_location: formInput.init_map_location,
        }}
        handleMarker={(location) => {
          setFormInput((prevState) => ({
            ...prevState,
            map_location_lat: location?.lat && location?.lng ? location.lat : 0,
            map_location_long:
              location?.lat && location?.lng ? location.lng : 0,
            geo_address: location?.geo_address || "",
            init_map_location: location.init_map_location,
          }));
          if (location.detail) {
            handleGeoAddress(location.detail);
          }
        }}
      />
    </div>
  );
};

export default GeoAddress;
