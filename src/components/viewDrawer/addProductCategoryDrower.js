import React, { useContext, useState, useEffect } from "react";
import Context from "../../context/Context";
import { Checkbox, Modal, Tooltip, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  editProductCategoryAction,
  productCategoryAction,
} from "../../redux/action/productCategoryAction";
import KnowMore from "../../assets/know-more.svg";
import IsMenu from "../../assets/is-menu-tooltip.gif";
import IsFeature from "../../assets/is-feature-tooltip.gif";
import DefaultImage from "../../assets/default-image.svg";

const AddProductCategory = () => {
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const { addProductCategoryOpen, setAddProductCategoryOpen } = context;
  const dispatch = useDispatch();
  const [gifLoop, setGifLoop] = useState("");

  const initialInput = {
    name: "",
    is_menu: false,
    is_featured: false,
  };
  const [formInput, setFormInput] = useState(initialInput);
  const [error, setError] = useState(false);

  const handleFormInputChange = (e) => {
    if (e.target.name === "name") {
      setFormInput((prevState) => {
        return { ...prevState, [e.target.name]: e.target.value };
      });
      return;
    }
    setFormInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.checked };
    });
  };

  const onClose = () => {
    setAddProductCategoryOpen(false);
    setFormInput(initialInput);
  };

  const onFinish = (e) => {
    e.preventDefault();
    if (!formInput.name) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      notification.warning({ message: "Please Enter The Name" });
      return;
    }
    const apiData = formInput;
    dispatch(editProductCategoryAction(apiData));
  };

  useEffect(() => {
    if (state.editProductCategory.data !== "") {
      if (state.editProductCategory.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return (
    <>
      <Modal
        className="container"
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Add New Product Category
          </div>
        }
        width={650}
        onCancel={onClose}
        open={addProductCategoryOpen}
        centered
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
            <button className="button_primary" onClick={onFinish}>
              Submit
            </button>
            <button
              className="button_secondary"
              style={{ marginRight: 20 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <form style={{ margin: 20 }}>
          <label
            style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 500 }}
          >
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            onChange={handleFormInputChange}
            value={formInput.name}
            name="name"
            placeholder="Enter Product Category"
            style={{ width: "94%", border: error ? "2px solid red" : "" }}
          />
          <br />
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "start" }}>
              <Checkbox
                onChange={handleFormInputChange}
                checked={formInput.is_menu}
                name="is_menu"
              />
              <div style={{ marginLeft: 10 }}>
                <label
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Is Menu
                  <Tooltip
                    style={{ width: "300px" }}
                    placement="bottom"
                    title={
                      <div>
                        Selected category will be shown in the top header mean
                        bar of the website
                        <img
                          src={gifLoop}
                          alt="img"
                          style={{ width: "100%" }}
                        />
                      </div>
                    }
                  >
                    <img
                      src={KnowMore}
                      alt="img"
                      style={{ margin: "0 10px" }}
                      onMouseEnter={() => setGifLoop(IsMenu)}
                      onMouseLeave={() => setGifLoop(DefaultImage)}
                    />
                  </Tooltip>
                </label>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "start", marginLeft: 30 }}
            >
              <Checkbox
                onChange={handleFormInputChange}
                checked={formInput.is_featured}
                name="is_featured"
              />
              <div style={{ marginLeft: 10 }}>
                <label
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Is Featured
                  <Tooltip
                    style={{ width: "300px" }}
                    placement="bottom"
                    title={
                      <div>
                        You can select up to 3 categories to feature on the main
                        landing page of our website.
                        <img
                          src={gifLoop}
                          alt="img"
                          style={{ width: "100%" }}
                        />
                      </div>
                    }
                  >
                    <img
                      src={KnowMore}
                      alt="img"
                      style={{ margin: "0 10px" }}
                      onMouseEnter={() => setGifLoop(IsFeature)}
                      onMouseLeave={() => setGifLoop(DefaultImage)}
                    />
                  </Tooltip>
                </label>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default AddProductCategory;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};
