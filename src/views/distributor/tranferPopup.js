import { Modal } from "antd";
import { useState } from "react";
import styles from "./transferPopup.module.css";
import { CloseOutlined } from "@ant-design/icons";
import tranferIcon from "../../assets/distributor/transferIcon.svg";
import { getChildLevelName } from "../../components/viewDrawer/distributor-details/customerDetailCard";
import CustomerTransferDetails from "../../components/viewDrawer/customer-transfer-details/transferDetails";

export default function TranferPopupConfirmation({
  isOpen,
  onChange,
  details,
}) {
  const [showTransferDetails, setShowTransferDetails] = useState(false);

  let childLevelName;

  if (details?.id) {
    childLevelName = getChildLevelName(details);
  }

  const handleClose = () => {
    onChange({
      toggle: false,
    });
  };

  return (
    <>
      <Modal
        centered
        open={isOpen}
        onCancel={handleClose}
        closable={false}
        footer={null}
        className="transfer_popup"
      >
        <div className={styles.main_container}>
          <div className={styles.space_between}>
            <p className={styles.heading}>
              <img src={tranferIcon} alt="transfer" />
              Transfer {details?.childCount} {childLevelName}
            </p>
            <CloseOutlined
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </div>
          <p style={{ color: "#727176" }}>
            {details?.childCount} {childLevelName} are mapped under{" "}
            {details?.name}, Transfer them to another{" "}
            {details?.customer_level_name} before deleting it.
          </p>
          <div
            className={`${styles.btn} button_primary`}
            onClick={() => {
              onChange({
                toggle: false,
              });
              setShowTransferDetails(true);
            }}
          >
            Transfer
          </div>
        </div>
      </Modal>
      <CustomerTransferDetails
        isOpen={showTransferDetails}
        details={details}
        onChange={(e) => setShowTransferDetails(e?.toggle)}
      />
    </>
  );
}
