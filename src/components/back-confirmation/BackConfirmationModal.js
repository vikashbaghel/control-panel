import { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { Modal } from "antd";
import "./styles.css";
import { INITIAL_DISCARD_MODAL } from "../../generic/contextConstant";

export default function BackConfirmationModal({ isValueChange=true }) {
  const context = useContext(Context);
  const { discardModalAction, setDiscardModalAction } = context;

  const closeModal = () => {
    setDiscardModalAction(INITIAL_DISCARD_MODAL);
  };

  const handleOnDiscard = () => {
    discardModalAction.handleAction && discardModalAction.handleAction();
    closeModal();
  };

  useEffect(() => {
    if (discardModalAction.open && !isValueChange) {
      handleOnDiscard();
    }
  }, [discardModalAction.open]);

  return (
    <div className={"back_confirm_container"}>
      <Modal
        title={
          <div
            style={{
              padding: 20,
              paddingBottom: 5,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Discard Changes?
            <p style={{ fontSize: 14, color: "#727176" }}>
              Are you sure, you want to discard Changes?
            </p>
            <div
              style={{
                marginTop: 20,
                paddingBottom: 15,
                display: "flex",
                gap: 20,
                background: "#fff",
                justifyContent: "end",
              }}
            >
              <button
                className="button_primary"
                onClick={closeModal}
                style={style}
              >
                No
              </button>
              <button
                className="button_secondary"
                onClick={handleOnDiscard}
                style={style}
              >
                Discard
              </button>
            </div>
          </div>
        }
        closable={true}
        width={520}
        open={discardModalAction.open}
        centered
        footer={[]}
        onCancel={closeModal}
      ></Modal>
    </div>
  );
}

const style = { borderRadius: 8, width: 100, textAlign: "center" };
