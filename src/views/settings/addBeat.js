import { Modal, notification } from "antd";
import React, { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./settings.module.css";
import {
  beatAddService,
  beatEditService,
  beatService,
} from "../../redux/action/beatAction";
import BeatAssignModule from "../../components/beatAssignModule/beatAssignModule";

const AddBeatComponent = ({ data, pageCount }) => {
  const state = useSelector((state) => state);
  const [input, setInput] = useState(initialInput);
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { addBeatOpen, setAddBeatOpen } = context; // assign staff list data
  const [assignCustomer, setAssignCustomer] = useState({});
  const [error, setError] = useState(false);

  const onClose = () => {
    setAddBeatOpen(false);
    setInput(initialInput);
    setAssignCustomer({});
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setInput((prevInput) => ({
      ...prevInput,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    if (state.addBeat.data !== "") {
      if (state.addBeat.data.data.error === false) {
        if (state.addBeat.data.status === 200) {
          onClose();
        }
      }
    }
    if (state.editBeat.data !== "") {
      if (state.editBeat.data.data.error === false) {
        if (state.editBeat.data.status === 200) {
          onClose();
        }
      }
    }
  }, [state]);

  // Function to fetch data by ID (simulated with a timeout in this example)
  const fetchDataById = (data) => {
    setTimeout(() => {
      const fetchedData = {
        id: data?.id,
        name: data?.name,
      };
      setInput(fetchedData);
    }, 1000);
  };

  useEffect(() => {
    if (addBeatOpen && data) fetchDataById(data);
  }, [data, addBeatOpen]);

  useEffect(() => {
    data && beatService("", pageCount);
  }, []);

  const onSubmit = () => {
    if (!input.name) {
      notification.warning({ message: "Please enter required field" });
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }
    let values = input;
    Object.assign(values, {
      select_customer: assignCustomer,
    });
    data === "" && dispatch(beatAddService(values));
    data && dispatch(beatEditService(values));
    setTimeout(() => {
      dispatch(beatService("", pageCount));
      setAddBeatOpen(false);
    }, 400);
  };

  return (
    <>
      <Modal
        centered
        open={addBeatOpen}
        footer={null}
        closable={false}
        className={Styles.product_category_main}
        style={{ padding: "0px !important" }}
        width={600}
        onCancel={onClose}
      >
        <div className={Styles.beat_main_header}>
          <div className={Styles.product_category_main_header_title}>
            {data === "" ? "Create Beat" : "Update Beat"}
          </div>
          <div
            onClick={onClose}
            className={Styles.product_category_main_header_cross}
          >
            X
          </div>
        </div>
        <form>
          <div className={Styles.product_category_body_main}>
            <div className={Styles.product_category_body_name}>
              <label>
                Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={input.name}
                onChange={(e) =>
                  /^[a-zA-Z0-9#\/(),.+\-:&% ]*$/.test(e.target.value) &&
                  handleInputChange(e)
                }
                placeholder="Enter Beat Name"
                required
                style={{ border: error && "2px solid red" }}
              />
            </div>
            <BeatAssignModule
              title={"Customer"}
              searchLabel={"Select Customer Name"}
              incoiming={(data) => {
                setAssignCustomer(data);
              }}
              selectedOptionsList={assignCustomer}
            />
          </div>
        </form>
        <div className={Styles.product_category_footer}>
          <button
            className="button_secondary"
            onClick={() => {
              setAddBeatOpen(false);
              setInput(initialInput);
              setAssignCustomer({});
            }}
          >
            Cancel
          </button>
          <button className="button_primary" onClick={onSubmit}>
            {data ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AddBeatComponent;

const initialInput = {
  name: "",
};
