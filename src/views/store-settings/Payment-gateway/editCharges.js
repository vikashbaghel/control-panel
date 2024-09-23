import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { decimalInputValidation } from "../../../helpers/regex";
import { Button, Input, Modal, Select, notification } from "antd";
import { editGatewayCharges } from "../../../redux/action/razorpayServices";

export default function EditCharges({
  editChargesData,
  setEditChargesData,
  refetchList,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [chargesDetails, setChargesDetails] = useState({
    name: "",
    type: "",
    value: "",
  });

  const closeModal = () => {
    setEditChargesData({});
    setChargesDetails({});
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await editGatewayCharges({
      charges: {
        ...chargesDetails,
        value: chargesDetails?.value ? chargesDetails?.value : 0,
      },
    });

    if (res && res.status === 200) {
      closeModal();
      notification.success({ message: res.data.message });
      refetchList();
    }
    setIsLoading(false);
  };

  const footer = (
    <div className={`${styles.flex} ${styles.edit_modal_footer}`}>
      <Button
        className="button_secondary"
        style={{ paddingBlock: 0 }}
        onClick={closeModal}
      >
        Cancel
      </Button>
      <Button
        className="button_primary"
        onClick={handleSubmit}
        loading={isLoading}
      >
        Save
      </Button>
    </div>
  );

  useEffect(() => {
    if (editChargesData) {
      setChargesDetails({
        id: editChargesData?.id,
        name: editChargesData?.charges?.name,
        type: editChargesData?.charges?.type,
        value: editChargesData?.charges?.value,
      });
    }
  }, [editChargesData]);

  return (
    <Modal
      centered
      open={Object.keys(editChargesData).length}
      onCancel={closeModal}
      title={<div className={styles.edit_title}>Edit Transaction Charges</div>}
      footer={footer}
    >
      <div className={styles.edit_modal_body}>
        <p className={styles.color_grey}>
          Enable Transaction Fee on payments via the payment gateway to cover
          any processing/payment gateway costs. (For Eg: 2% of every
          transaction)
        </p>
        <div className={styles.flex_col_5}>
          <p className={styles.bold}>Charge name</p>
          <Input
            onChange={(e) =>
              setChargesDetails({ ...chargesDetails, name: e.target.value })
            }
            value={chargesDetails.name}
          />
        </div>
        <div className={styles.flex_col_5}>
          <p className={styles.bold}>Charges Value</p>
          <div className={styles.flex}>
            <Select
              onChange={(v) =>
                setChargesDetails({ ...chargesDetails, type: v, value: "" })
              }
              options={[
                { value: "Percentage", label: "Percentage" },
                { value: "Fixed", label: "Fixed" },
              ]}
              value={chargesDetails.type}
              style={{ width: "100%" }}
            />
            <Input
              onChange={(e) =>
                setChargesDetails({ ...chargesDetails, value: e.target.value })
              }
              onKeyPress={(e) => {
                decimalInputValidation(e, {
                  decimalPlaces: 2,
                  type: chargesDetails.type === "Percentage" ? "discount" : "",
                });
              }}
              {...(chargesDetails.type === "Fixed"
                ? { addonBefore: "₹", maxLength: 8 }
                : { addonAfter: "%" })}
              placeholder="0"
              value={chargesDetails?.value || ""}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
