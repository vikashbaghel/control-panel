import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Modal } from "antd";
// import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Cancel, Click } from "../../assets/attendance";
import "./camera.css";

const Camera = ({ formInput, setFormInput, showOption, setShowOption }) => {
  const webcamRef = useRef(null);
  const [loader, setLoader] = useState(true);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = dataURLtoBlob(imageSrc);
    const file = new File([blob], "webcam-image.png", { type: "image/png" });
    // Now you can use the 'file' variable to access the captured image file
    setFormInput((prev) => ({
      ...prev,
      images: prev.images.concat([
        {
          originFileObj: file,
          type: "image/jpeg",
          name: file.name,
          thumbUrl: imageSrc,
        },
      ]),
    }));
    setShowOption(false);
    stopWebcam();
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const deleteImage = (item) => {
    let tempImgList = formInput.images.filter((file) => file !== item);
    setFormInput((prev) => ({
      ...prev,
      images: tempImgList,
    }));
  };

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const webcam = webcamRef.current;
        webcam.video.srcObject = stream;
        setLoader(false);
      })
      .catch((error) => {
        console.log("Error accessing webcam:", error);
      });
  };

  const stopWebcam = () => {
    const webcam = webcamRef.current;
    const mediaStream = webcam.video.srcObject;

    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      setLoader(true);
    }
  };

  const onClose = () => {
    setShowOption(false);
    stopWebcam();
  };

  useEffect(() => {
    if (showOption) {
      startWebcam();
    }
  }, [showOption]);

  return (
    <>
      <Modal
        open={showOption}
        onCancel={onClose}
        footer={<></>}
        width={800}
        centered
        key={`start-camera-${showOption}`}
        zIndex={10001}
      >
        <div style={{ height: 590 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: "100%", height: "auto", borderRadius: 5 }}
          />
          {!loader && (
            <div>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: "30px",
                }}
              >
                <img
                  src={Click}
                  alt="camera"
                  onClick={captureImage}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}
      >
        {formInput.images.map((image, index) => (
          <div key={index} style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            >
              <img
                src={Cancel}
                alt="cancel"
                style={{ cursor: "pointer" }}
                onClick={() => deleteImage(image)}
              />
            </div>
            <img
              src={image.thumbUrl}
              alt=""
              style={{
                width: "100px",
                borderRadius: "3px",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Camera;
