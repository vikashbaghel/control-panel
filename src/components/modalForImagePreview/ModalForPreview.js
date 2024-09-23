import React, { useContext } from "react";
import Context from "../../context/Context";
import { Modal } from "antd";

const ModalForImagePreview = ({ props }) => {
  const context = useContext(Context);
  const { previewOpen, setPreviewOpen, previewImage } = context;

  //   Handle Cancel button
  const handleCancel = () => setPreviewOpen(false);

  return (
    <>
      <div>
        {/* Modal Start */}
        <Modal
          open={previewOpen}
          title="Upload Image Preview"
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
        {/* Modal End */}
      </div>
    </>
  );
};

export default ModalForImagePreview;
