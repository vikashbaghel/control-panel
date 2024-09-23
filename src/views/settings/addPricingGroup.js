// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Settings

import { Modal, notification } from "antd";
import React, { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Styles from "./settings.module.css";
import {
  addPricingGroup,
  editPricingGroup,
  pricingGroupListService,
} from "../../redux/action/pricingGroupAction";

const AddPricingGroupComponent = ({ data, pageCount }) => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState(initialInput);
  const [OTP, setOTP] = useState("");
  const [formCount, setFormCount] = useState(1);
  // for error handling
  const [error, setError] = useState(initialErrorState);
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { productPricingGroupAddOpen, setProductPricingGroupAddOpen } = context;

  const onClose = () => {
    setProductPricingGroupAddOpen(false);
    setFormInput(initialInput);
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
    if (state.addPricingGroup.data !== "") {
      if (state.addPricingGroup.data.data.error === false) {
        if (state.addPricingGroup.data.status === 200) {
          onClose();
          // setFormInput(initialInput);
          setTimeout(() => {
            navigate(
              `/web/product-pricing/?name=${formInput.name}&id=${state.addPricingGroup.data.data.data.id}&description=${formInput.description}`
            );
            // window.location.reload();
          }, 500);
        }
      }
    }

    if (state.editPricingGroup.data !== "") {
      if (state.editPricingGroup.data.data.error === false) {
        if (state.editPricingGroup.data.status === 200) {
          onClose();
          // setFormInput(initialInput);
          setTimeout(() => {
            navigate(
              `/web/product-pricing/?name=${formInput.name}&id=${state.editPricingGroup.data.data.data.id}&description=${formInput.description}`
            );
          }, 500);
        }
      }
    }
  }, [state]);

  // Function to fetch data by ID (simulated with a timeout in this example)
  const fetchDataById = (data) => {
    setTimeout(() => {
      const fetchedData = {
        id: data?.id,
        name: data?.name || "",
        description: data?.description || "",
      };
      setFormInput(fetchedData);
    }, 1000);
  };
  useEffect(() => {
    if (data) {
      fetchDataById(data);
      return;
    }
    setFormInput(initialInput);
  }, [data, productPricingGroupAddOpen]);

  useEffect(() => {
    data && pricingGroupListService("", pageCount);
  }, []);

  const onSubmit = () => {
    if (!formInput.name) {
      notification.warning({ message: "Please enter required field" });

      return setError((prevState) => ({
        ...prevState,
        name: true,
      }));
    }
    !data.id && dispatch(addPricingGroup(formInput));
    data.id && dispatch(editPricingGroup(formInput));
  };

  // resetting the state of error
  useEffect(() => {
    setTimeout(() => {
      setError(initialErrorState);
    }, 3000);
  }, [error]);

  return (
    <>
      <Modal
        centered
        open={productPricingGroupAddOpen}
        width={700}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {!data.id ? "Add Pricing Group" : "Update Pricing Group"}
          </div>
        }
        onCancel={onClose}
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
              style={{ marginRight: 20 }}
              onClick={() => {
                setProductPricingGroupAddOpen(false);
                setFormCount(1);
                setFormInput(initialInput);
                setOTP("");
              }}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <div
          style={{ padding: "10px 20px" }}
          className={Styles.product_category_body}
        >
          <label>
            Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <input
            type="text"
            name="name"
            value={formInput.name}
            onChange={(e) =>
              /^[a-zA-Z0-9#\/(),.+\-:&% ]*$/.test(e.target.value) &&
              handleInputChange(e)
            }
            placeholder="Enter  Name"
            className={error.name ? Styles.input_error : ""}
            style={{ width: "90%" }}
          />
          {error.first_name ? (
            <div className={Styles.error}>Enter the name</div>
          ) : (
            <></>
          )}
          <br />
          <br />
          <label>Description </label>
          <textarea
            type="text"
            name="description"
            rows={6}
            value={formInput.description}
            onChange={handleInputChange}
            style={{ resize: "none", width: "90%" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default AddPricingGroupComponent;

const initialInput = {
  name: "",
  description: "",
};

const initialErrorState = {
  name: false,
  description: false,
};
