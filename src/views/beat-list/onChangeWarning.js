import { Modal } from "antd";
import styles from "./beat.module.css";
import warningIcon from "../../assets/images/geo-alert.svg";
import Cookies from "universal-cookie";

export default function OnChangeWarning(props) {
  const {
    warningModal,
    setWarningModal,
    selectedCustomerLevel,
    setRemoveMappedCustomers,
  } = props;

  const cookies = new Cookies();
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  return (
    <Modal
      open={warningModal}
      onCancel={() => setWarningModal(false)}
      title={
        <>
          <div
            style={{ fontSize: 20, padding: ".5em 1em", gap: "0.5em" }}
            className={styles.flex_center}
          >
            <img src={warningIcon} alt="warining" /> Alert
          </div>
          <div style={{ padding: ".5em 1.5em" }}>
            <p>
              If you Add/Change the{" "}
              {selectedCustomerLevel.label ||
                customerLevelList["LEVEL-1"] +
                  "/" +
                  customerLevelList["LEVEL-2"]}
              , all the customer's will be removed from this Beat.
            </p>
            <p style={{ color: "#727176" }}>
              Are you sure, you want to change the{" "}
              {selectedCustomerLevel.label ||
                customerLevelList["LEVEL-1"] +
                  "/" +
                  customerLevelList["LEVEL-2"]}
              ?
            </p>
          </div>
          <div className={styles.form_footer}>
            <div
              className="button_secondary"
              onClick={() => {
                setRemoveMappedCustomers(false);
                setWarningModal(false);
              }}
            >
              No
            </div>
            <div
              className="button_primary"
              onClick={() => {
                setRemoveMappedCustomers(true);
                setWarningModal(false);
              }}
            >
              Yes
            </div>
          </div>
        </>
      }
      footer={null}
    ></Modal>
  );
}
