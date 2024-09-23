import { Modal } from "antd";
import React, { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./settings.module.css";
import { customerTypeAction } from "../../redux/action/cutomerTypeAction";
import {
  createAdmin as createAdminAPI,
  veifyAdminOTP as veifyAdminOTPAPI,
} from "../../redux/action/adminSetting";
import { numberValidation } from "../../helpers/regex";
import { adminList as adminListAPI } from "../../redux/action/adminSetting";

const AddAdminComponent = ({ data, pageCount }) => {
  const { createAdmin, veifyAdminOTP } = useSelector((state) => state);
  const [formInput, setFormInput] = useState(initialInput);
  const [OTP, setOTP] = useState("");
  const [formCount, setFormCount] = useState(1);
  // for error handling
  const [error, setError] = useState(initialErrorState);
  const [formAfterSubmitData, setFormAfterSubmitData] = useState();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { createAdminIsOpen, setCreateAdminIsOpen } = context;

  const onClose = () => {
    setCreateAdminIsOpen(false);
    setFormInput(initialInput);
    setFormCount(1);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    if (createAdmin.data && !createAdmin.data.data.error) {
      setFormAfterSubmitData(createAdmin.data.data.data.otp_ref);
      if (createAdmin.data.status === 200) setFormCount(2);
    }
    if (veifyAdminOTP.data && !veifyAdminOTP.data.data.error) {
      if (veifyAdminOTP.data.status === 200) {
        setFormInput(initialInput);
        dispatch(adminListAPI("", pageCount));
        setCreateAdminIsOpen(false);
      }
      onClose();
    }
  }, [createAdmin, veifyAdminOTP]);

  // Function to fetch data by ID (simulated with a timeout in this example)
  const fetchDataById = (data) => {
    setTimeout(() => {
      const fetchedData = {
        id: data?.id,
        first_name: data ? data?.first_name : "",
        last_name: data ? data?.last_name : "",
        mobile: data ? data?.mobile : "",
        email: data ? data?.email : "",
      };
      setFormInput(fetchedData);
    }, 1000);
  };

  useEffect(() => {
    fetchDataById(data);
  }, [data]);

  useEffect(() => {
    data && customerTypeAction("", pageCount);
  }, []);

  const onSubmit = () => {
    if (formCount === 1) {
      if (formInput.first_name === "") {
        setError((prevState) => ({
          ...prevState,
          first_name: true,
        }));
      }
      if (formInput.last_name === "") {
        setError((prevState) => ({
          ...prevState,
          last_name: true,
        }));
      }
      if (formInput.mobile === "") {
        setError((prevState) => ({
          ...prevState,
          mobile: true,
        }));
      }
      if (formInput.email === "") {
        setError((prevState) => ({
          ...prevState,
          email: true,
        }));
      }
      if (
        formInput.first_name &&
        formInput.last_name &&
        formInput.email &&
        formInput.mobile
      ) {
        data === "" && dispatch(createAdminAPI(formInput));
        data && dispatch(createAdminAPI(formInput));
      }
      return;
    }
    const apiData = {
      otp_ref: formAfterSubmitData,
      mobile: formInput.mobile,
      otp: OTP,
    };
    dispatch(veifyAdminOTPAPI(apiData));
  };

  // resetting the state of error
  useEffect(() => {
    setTimeout(() => {
      setError(initialErrorState);
    }, 2000);
  }, [error]);

  return (
    <>
      <Modal
        centered
        open={createAdminIsOpen}
        className={Styles.product_category_main}
        style={{ padding: "0px !important" }}
        width={600}
        onCancel={onClose}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {data === "" ? "Add New Admin" : "Update Admin"}
          </div>
        }
        footer={[
          <div
            style={{
              marginTop: 20,
              display: "flex",
              background: "#fff",
              padding: 15,
              flexDirection: "row-reverse",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button className="button_primary" onClick={onSubmit}>
              Save
            </button>
            <button
              className="button_secondary"
              onClick={() => {
                setCreateAdminIsOpen(false);
                setFormCount(1);
                setFormInput(initialInput);
                setOTP("");
              }}
              style={{ marginRight: 20 }}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        {formCount === 1 && (
          <form>
            <div className={Styles.product_category_body_main}>
              <div className={Styles.product_category_body_name}>
                <label>
                  First Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formInput.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter First Name"
                  className={error.first_name ? Styles.input_error : ""}
                />
                {error.first_name ? (
                  <div className={Styles.error}>Enter the first name</div>
                ) : (
                  <></>
                )}
              </div>
              <div className={Styles.product_category_body_name}>
                <label>
                  Last Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formInput.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter Last Name"
                  className={error.last_name ? Styles.input_error : ""}
                />
                {error.last_name ? (
                  <div className={Styles.error}>Enter the last name</div>
                ) : (
                  <></>
                )}
              </div>
              <div className={Styles.product_category_body_name}>
                <label>
                  Mobile Number <sup style={{ color: "red" }}>*</sup>{" "}
                </label>
                <input
                  type="mobile"
                  name="mobile"
                  maxLength={10}
                  value={formInput.mobile}
                  onKeyPress={numberValidation}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile Number"
                  className={error.mobile ? Styles.input_error : ""}
                />
                {error.mobile ? (
                  <div className={Styles.error}>Enter the mobile number</div>
                ) : (
                  <></>
                )}
              </div>
              <div className={Styles.product_category_body_name}>
                <label>
                  E-Mail <sup style={{ color: "red" }}>*</sup>{" "}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formInput.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className={error.email ? Styles.input_error : ""}
                />
                {error.email ? (
                  <div className={Styles.error}>Enter the email</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        )}
        {formCount === 2 && (
          <form>
            <div className={Styles.product_category_body_main}>
              <div className={Styles.product_category_body_name}>
                <label>
                  Mobile Number <sup style={{ color: "red" }}>*</sup>{" "}
                </label>
                <input
                  type="otp"
                  name="otp"
                  maxLength={4}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="Enter OTP"
                  className={error.mobile ? Styles.input_error : ""}
                />
                {error.mobile ? (
                  <div className={Styles.error}>Enter the OTP</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default AddAdminComponent;

const initialInput = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
};

const initialErrorState = {
  first_name: false,
  last_name: false,
  mobile: false,
  email: false,
};
