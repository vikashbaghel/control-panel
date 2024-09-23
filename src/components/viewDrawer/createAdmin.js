import React, { useState, useContext, useEffect } from "react";
import Context from "../../context/Context";
import { Button, Drawer, Input, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createAdmin, veifyAdminOTP } from "../../redux/action/adminSetting";

const CreateAdmin = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { createAdminIsOpen, setCreateAdminIsOpen } = context;
  const state = useSelector((state) => state);

  const initialValues = {
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
  };
  const [formInput, setFormInput] = useState(initialValues);
  const [stepCount, setStepCount] = useState(1);
  const [OTP, setOTP] = useState("");

  const onClose = () => {
    setCreateAdminIsOpen(false);
    setFormInput(initialValues);
    setStepCount(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stepCount === 1) {
      if (
        formInput.first_name === "" ||
        formInput.last_name === "" ||
        formInput.email === "" ||
        formInput.mobile === ""
      ) {
        notification.warning({ message: "Please Enter Required Fields" });
        return;
      }
      if (formInput.mobile.length !== 10) {
        notification.warning({ message: "Please Enter Correct Number" });
        return;
      }
      dispatch(createAdmin(formInput));

      return;
    }
    const apiData = {
      otp_ref: state.createAdmin.data.data.data.otp_ref,
      mobile: formInput.mobile,
      otp: OTP,
    };
    dispatch(veifyAdminOTP(apiData));
  };

  useEffect(() => {
    if (state.createAdmin.data !== "") {
      if (state.createAdmin.data.data.error === false)
        setStepCount(stepCount + 1);
    }
    if (state.veifyAdminOTP.data !== "") {
      if (state.veifyAdminOTP.data.data.error === false) onClose();
    }
  }, [state]);

  return (
    <div>
      {" "}
      <Drawer
        title={
          <div style={{ alignItems: "center", display: "flex" }}>
            <CloseOutlined onClick={onClose} style={{ fontSize: 25 }} />
            &nbsp;&nbsp;&nbsp; Add New Admin
          </div>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={createAdminIsOpen}
        style={{ overflowY: "auto" }}
        className="goal_assigment_view"
      >
        {stepCount === 1 ? (
          <div style={{ margin: "40px 20px" }}>
            <div>
              <label>
                First Name <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <Input
                style={{ margin: "10px 0 20px 0" }}
                placeholder="Enter First Name"
                type="text"
                onChange={(e) =>
                  setFormInput((prevState) => ({
                    ...prevState,
                    first_name: e.target.value,
                  }))
                }
                value={formInput.first_name}
              />
            </div>
            <div>
              <label>
                Last Name <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <Input
                style={{ margin: "10px 0 20px 0" }}
                placeholder="Enter Last Name"
                value={formInput.last_name}
                type="text"
                onChange={(e) =>
                  setFormInput((prevState) => ({
                    ...prevState,
                    last_name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label>
                Mobile Number <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <Input
                style={{ margin: "10px 0 20px 0" }}
                placeholder="Enter Mobile Number"
                value={formInput.mobile}
                type="mobile"
                onChange={(e) =>
                  setFormInput((prevState) => ({
                    ...prevState,
                    mobile: e.target.value,
                  }))
                }
                maxLength={10}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <label>
                E-mail <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <Input
                style={{ margin: "10px 0 20px 0" }}
                placeholder="Enter Email"
                value={formInput.email}
                type="email"
                onChange={(e) =>
                  setFormInput((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        ) : (
          <div style={{ margin: "40px 20px" }}>
            <label>
              Mobile Number <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <Input
              placeholder="OTP"
              name="otp"
              onChange={(e) => setOTP(e.target.value)}
              maxLength={4}
              type="mobile"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            padding: "20px",
            borderTop: "1px solid #ddd",
            width: 520,
          }}
        >
          <div>
            <Button
              type="primary"
              size="large"
              style={{ marginRight: 30 }}
              onClick={handleSubmit}
            >
              Continue
            </Button>
            <Button size="large" onClick={onClose}>
              CANCEL
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CreateAdmin;
