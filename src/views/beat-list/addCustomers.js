import { Modal } from "antd";
import { useState } from "react";
import styles from "./beat.module.css";
import CustomersList from "./customersList";

export default function AddCustomers(props) {
  const {
    addCustomersModal,
    setAddCustomerModal,
    formValues,
    setFormValues,
    removeMappedCustomers,
  } = props;

  const [values, setValues] = useState({});

  const handleSave = () => {
    setFormValues({ ...formValues, select_customer: values });
    setAddCustomerModal(false);
  };

  const handleClose = () => {
    setAddCustomerModal(false);
  };

  return (
    <Modal
      key={addCustomersModal}
      open={addCustomersModal}
      onCancel={handleClose}
      title={
        <div
          style={{
            textAlign: "center",
            fontFamily: "Poppins",
            paddingBlock: "1em",
          }}
        >
          <p style={{ margin: 0 }}>Add Customers</p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#727176",
              fontWeight: 500,
            }}
          >
            {formValues?.parent_customer_name}
          </p>
        </div>
      }
      footer={
        <div className={styles.form_footer}>
          <div className="button_secondary" onClick={handleClose}>
            Cancel
          </div>
          <div className="button_primary" onClick={handleSave}>
            Save
          </div>
        </div>
      }
    >
      <CustomersList
        {...{
          formValues,
          setFormValues,
          addCustomersModal,
          removeMappedCustomers,
          setValues,
        }}
      />
    </Modal>
  );
}
