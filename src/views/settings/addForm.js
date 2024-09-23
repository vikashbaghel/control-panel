import React, { useState } from "react";
import Styles from "./settings.module.css";
import { Button } from "antd";

const CustomModal = ({ visible, onCancel, title, content }) => {
  
    return (
        <div className={`custom-modal ${visible ? "visible" : "hidden"}`}>
        <div className="custom-modal-content">
          <div className="custom-modal-header">
            <h2>{title}</h2>
          </div>
          <div className="custom-modal-body">{content}</div>
          <div className="custom-modal-footer">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={onCancel}>
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  
};

export default CustomModal;
