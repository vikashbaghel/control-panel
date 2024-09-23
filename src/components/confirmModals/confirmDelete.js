import { Modal } from "antd";
import React, { useContext } from "react";
import styles from "./confirmDelete.module.css";
import Context from "../../context/Context";

const ConfirmDelete = ({
  title,
  deleteModal,
  setDeleteModal,
  confirmValue,
}) => {
  const context = useContext(Context);
  const { deleteModalOpen, setDeleteModalOpen } = context;

  const onCancel = () => {
    !deleteModal ? setDeleteModalOpen(false) : setDeleteModal(false);
  };

  const onSubmit = () => {
    confirmValue(true);
    setTimeout(() => onCancel(), 500);
  };

  return (
    title && (
      <div>
        <Modal
          centered
          open={deleteModalOpen || deleteModal}
          className={styles.delet_main}
          onCancel={onCancel}
          title={
            <div>
              <div
                style={{
                  padding: 15,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {title === "Payment Gateway"
                  ? "Deactivate Payment Gateway "
                  : `Delete ${title} `}
                ?
              </div>
              <div className={styles.delet_p}>
                Are You Sure, You want to{" "}
                {title === "Payment Gateway" ? "Deactivate" : "Delete"} Your{" "}
                {title} ?
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  background: "#fff",
                  padding: 15,
                  flexDirection: "row-reverse",
                  borderRadius: "0 0 10px 10px",
                }}
                className={styles.edit_header}
              >
                <button className="button_primary" onClick={onSubmit}>
                  {title === "Payment Gateway" ? "Deactivate" : "Delete"}
                </button>
                <button
                  className="button_secondary"
                  style={{ marginRight: 20 }}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          }
          footer={[]}
        ></Modal>
      </div>
    )
  );
};

export default ConfirmDelete;
