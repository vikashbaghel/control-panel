import { Modal } from "antd";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import styles from "./customerProfile.module.css";
import { EditIcon } from "../../../assets/globle";
import { useDispatch, useSelector } from "react-redux";
import handleParams from "../../../helpers/handleParams";
import getValidAddress from "../../../helpers/validateAddress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customerDetails } from "../../../redux/action/customerAction";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import WrapText from "../../wrapText";

export default function CutomerProfileDetails() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  const [searchParams, setSearchParams] = useSearchParams();
  const viewDetails = searchParams.get("view_details");
  const customerId = searchParams.get("id");

  const [customerProfileDetails, setCustomerProfileDetails] = useState({});
  const [previewOpen, setPreViewOpen] = useState(false);

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  useEffect(() => {
    viewDetails && dispatch(customerDetails(customerId));
  }, [customerId]);

  useEffect(() => {
    if (
      state.disributor_details.data !== "" &&
      !state.disributor_details.data.data.error
    )
      setCustomerProfileDetails(state.disributor_details.data.data.data);
  }, [state]);

  return (
    <>
      {viewDetails && (
        <div className={styles.customer_profile}>
          <div className={styles.profile_img_details}>
            <img
              src={customerProfileDetails?.logo_image_url || customerIcon}
              alt={customerProfileDetails?.name}
              className={styles.profile_img}
              onClick={() => setPreViewOpen(true)}
            />
            <p className={styles.customer_name}>
              <WrapText width={300}>{customerProfileDetails?.name}</WrapText>
            </p>
            <p
              className={styles.edit_icon}
              onClick={() => {
                navigate(
                  `/web/customer/add-customer?id=${customerProfileDetails?.id}`
                );
              }}
            >
              <img src={EditIcon} alt="edit" /> Edit Profile
            </p>
          </div>
          <div className={styles.customer_details}>
            <p className={styles.customer_detail_heading}>Contact Person</p>
            <p className={styles.heading_detail}>
              <WrapText width={300}>
                {customerProfileDetails?.contact_person_name}
              </WrapText>
            </p>
            {customerProfileDetails?.customer_parent_name && (
              <>
                <p className={styles.customer_detail_heading}>
                  {
                    customerLevelList[
                      "LEVEL-" +
                        (customerProfileDetails?.customer_level[
                          customerProfileDetails?.customer_level?.length - 1
                        ] -
                          1)
                    ]
                  }
                </p>
                <p
                  style={{ textTransform: "capitalize" }}
                  className={styles.link}
                  onClick={() =>
                    handleParams(searchParams, setSearchParams, {
                      id: customerProfileDetails?.customer_parent,
                    })
                  }
                >
                  {customerProfileDetails?.customer_parent_name}
                </p>
              </>
            )}
            <p className={styles.customer_detail_heading}>Address</p>
            <a
              href={
                customerProfileDetails?.map_location_lat &&
                customerProfileDetails?.map_location_long
                  ? `https://maps.google.com/?q=${customerProfileDetails?.map_location_lat},${customerProfileDetails?.map_location_long}`
                  : ""
              }
              onClick={(e) => {
                if (
                  !customerProfileDetails?.map_location_lat ||
                  !customerProfileDetails?.map_location_long
                ) {
                  e.preventDefault();
                }
              }}
              target="_blank"
              rel="noreferrer noopener"
              className={
                customerProfileDetails?.map_location_lat &&
                customerProfileDetails?.map_location_long
                  ? styles.link
                  : styles.heading_detail
              }
            >
              {getValidAddress(customerProfileDetails)}
            </a>
            {customerProfileDetails?.customer_type && (
              <>
                <p className={styles.customer_detail_heading}>Customer Type</p>
                <p className={styles.heading_detail}>
                  {customerProfileDetails?.customer_type}
                </p>
              </>
            )}
            {customerProfileDetails?.beat_list?.length > 0 && (
              <>
                <p className={styles.customer_detail_heading}>Beat</p>
                <p className={styles.heading_detail}>
                  {customerProfileDetails?.beat_list?.map(
                    (ele, index) =>
                      ele +
                      (index < customerProfileDetails?.beat_list?.length - 1
                        ? ", "
                        : "")
                  )}
                </p>
              </>
            )}

            <p className={styles.customer_detail_heading}>Mobile Number</p>
            <p className={styles.heading_detail}>
              {customerProfileDetails?.mobile}
            </p>
            {customerProfileDetails?.email && (
              <>
                <p className={styles.customer_detail_heading}>Email ID</p>
                <p className={styles.heading_detail}>
                  {customerProfileDetails?.email}
                </p>
              </>
            )}
            {customerProfileDetails?.pan_id && (
              <>
                <p className={styles.customer_detail_heading}>PAN Number</p>
                <p className={styles.heading_detail}>
                  {customerProfileDetails?.pan_id}
                </p>
              </>
            )}
            {customerProfileDetails?.gstin && (
              <>
                <p className={styles.customer_detail_heading}>GST Number</p>
                <p className={styles.heading_detail}>
                  {customerProfileDetails?.gstin}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      <Modal
        open={previewOpen}
        onCancel={() => setPreViewOpen(false)}
        closable={false}
        footer={""}
      >
        <img
          src={customerProfileDetails?.logo_image_url || customerIcon}
          alt="img"
          style={{ width: "100%", height: "70vh", objectFit: "contain" }}
        />
      </Modal>
    </>
  );
}
