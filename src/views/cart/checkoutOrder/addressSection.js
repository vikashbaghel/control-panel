import React from "react";
import styles from "./checkout.module.css";
import { WareHouse } from "../../../assets";
import { Dropdown } from "antd";
import { EditIcon } from "../../../assets/globle";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AddItemsButton } from "../../product/form/commonElements/CommonElements";
import getValidAddress from "../../../helpers/validateAddress";

const AddressSection = ({ onFinish, selectedAddress, customer_id }) => {
  const navigate = useNavigate();
  const items = [
    {
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => {
            navigate(
              `/web/distributor/product-list/cart/address/create/?customer=${customer_id}&id=${selectedAddress.id}`
            );
          }}
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
  ];

  return (
    <div className={styles.delivery_address_container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className={styles.conatiner_head}>Delivery Address</div>
        {selectedAddress?.id && (
          <div
            className={styles.all_address}
            onClick={() =>
              navigate(
                `/web/distributor/product-list/cart/address/${customer_id}`
              )
            }
          >
            All Addresses
          </div>
        )}
      </div>
      {selectedAddress?.id && (
        <div className={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={styles.section_head}>
              <img src={WareHouse} alt="logo" />
              {selectedAddress?.name}
            </div>
            <Dropdown
              menu={{
                items,
              }}
              className="action-dropdown"
            >
              <div className="clickable">
                <MoreOutlined className="action-icon" />
              </div>
            </Dropdown>
          </div>
          <div className={styles.address_line}>
            {getValidAddress({
              ...selectedAddress,
              ...{
                address_line_2: "",
              },
            })}
          </div>
          <br />
        </div>
      )}
      <div>
        <AddItemsButton
          onClick={() =>
            navigate(
              `/web/distributor/product-list/cart/address/create?customer=${customer_id}`
            )
          }
        >
          Add {selectedAddress?.id ? "another" : "new"} Address
        </AddItemsButton>
      </div>
      <div className={styles.address_button_group}>
        <button className="button_secondary" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="button_primary"
          style={{ borderRadius: 5 }}
          onClick={onFinish}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddressSection;
