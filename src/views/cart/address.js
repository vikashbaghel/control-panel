// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Address-(Add/Edit)

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./address.module.css";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";
import { ArrowLeft, EditIcon } from "../../assets/globle";
import { capitalizeFirst } from "../dashboard";
import { AddItemsButton } from "../product/form/commonElements/CommonElements";
import { WareHouse } from "../../assets";
import { addressList as addressListAPI } from "../../redux/action/checkoutAction";
import { useParams } from "react-router-dom";
import cartService from "../../services/cart-service";

const Address = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { addressList } = state;

  const [loader, setLoader] = useState(true);
  const [addressListData, setAddressListData] = useState("");

  const { customer_id } = useParams();

  const handleSelectAddress = (address) => {
    let paymentDetails = JSON.parse(
      localStorage.getItem("payment-details") || "{}"
    );
    paymentDetails.cartDetails.orderDetail["address"] = address;
    localStorage.setItem("payment-details", JSON.stringify(paymentDetails));
    // const cardDetails = cartService.getCartDetails();
    // cartService.updateCartDetails({
    //   orderDetail: { ...cardDetails.orderDetail, address },
    // });
    navigate(-1);
  };

  useEffect(() => {
    dispatch(addressListAPI(customer_id));
  }, []);

  useEffect(() => {
    if (addressList.data && addressList.data.data.error === false) {
      setAddressListData(addressList.data.data.data);
      setLoader(false);
    }
  }, [state]);

  if (loader) return [];
  return (
    <div style={{ position: "relative" }}>
      <h4
        className="page_title"
        style={{ display: "flex", alignItems: "center", fontSize: 18 }}
      >
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        &nbsp; All Address
      </h4>
      <div style={{ width: 220, position: "absolute", right: 24, top: 20 }}>
        <AddItemsButton
          onClick={() => {
            navigate(
              `/web/distributor/product-list/cart/address/create?customer=${customer_id}`
            );
          }}
        >
          Add another Address
        </AddItemsButton>
      </div>
      <div className={styles.address_page}>
        <div className={styles.address_container}>
          {addressListData &&
            addressListData?.map((data, index) => (
              <div
                key={index}
                className={styles.address_card}
                style={{
                  borderRadius: data?.is_default ? "0px 7px 7px 7px" : 7,
                }}
              >
                <div style={{ padding: 20, paddingBottom: 0 }}>
                  {data?.is_default && (
                    <p className={styles.default_tag}>Primary</p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className={styles.address_head}
                      style={{ wordBreak: "break-all" }}
                    >
                      {capitalizeFirst(data.name)}
                    </div>
                    <div>
                      <img
                        src={EditIcon}
                        alt="edit"
                        style={{ padding: 10, cursor: "pointer" }}
                        // onClick={() => {
                        //   setEditAddressViewOpen(true);
                        //   setnewAddressData(data);
                        // }}
                        onClick={() => {
                          navigate(
                            `/web/distributor/product-list/cart/address/create/?customer=${customer_id}&id=${data.id}`
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.address_info}>
                    <p className={styles.color_grey}>Address </p>
                    <p style={{ wordBreak: "break-all" }}>
                      {data.address_line_1}{" "}
                      {`${data.address_line_2 ? data.address_line_2 : ""}`}
                    </p>

                    <p className={styles.color_grey}>City </p>
                    <p>{data.city}</p>

                    <p className={styles.color_grey}>State </p>
                    <p>{data.state}</p>

                    <p className={styles.color_grey}>Pincode </p>
                    <p>{data.pincode}</p>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => handleSelectAddress(data)}
                >
                  <img src={WareHouse} alt="logo" /> Select Address
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <AddressEditView /> */}
      {/* <PaymentAgainstOrder /> */}
    </div>
  );
};

export default Address;
