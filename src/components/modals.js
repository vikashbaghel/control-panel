import { Modal, Space } from "antd";

export const GeneralModal = (props) => {
  return (
    <Modal
      {...props}
      centered
      closeIcon={false}
      footer={null}
      title={
        <div
          style={{
            padding: 24,
            paddingBottom: 8,
            fontSize: 18,
            lineHeight: "18px",
            fontWeight: 600,
          }}
        >
          <Space direction="vertical">
            {props.title}
            <p style={{ fontSize: 14 }}>{props.info}</p>
          </Space>
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
              style={{ height: 40, minWidth: 100 }}
              className="button_secondary"
              onClick={() => {
                props.onCancel && props.onCancel();
              }}
            >
              {props.cancelText || "No"}
            </button>
            <button
              style={{ height: 40, minWidth: 100 }}
              className="button_primary"
              onClick={() => {
                props.onOk && props.onOk();
              }}
            >
              {props.okText || "Yes"}
            </button>
          </div>
        </div>
      }
    />
  );
};
