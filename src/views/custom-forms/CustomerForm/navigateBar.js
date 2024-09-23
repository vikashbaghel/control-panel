import React, { useContext, useEffect, useState } from "react";
import styles from "./style.module.css";
import { Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import {
  customActivityList,
  deleteCustomActivity,
} from "../../../redux/action/customActivitytype";
import { useDispatch, useSelector } from "react-redux";
import WrapText from "../../../components/wrapText";
import Context from "../../../context/Context";

const FormNavigateBar = ({ form_name, setForm_name, setLoader }) => {
  setLoader(false);
  // const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  // const {
  //   customActivityListReducer,
  //   createCustomActivityReducer,
  //   updateCustomActivityReducer,
  //   deleteCustomActivityReducer,
  // } = state;

  const context = useContext(Context);
  const { deleteModalOpen, setDeleteModalOpen } = context;

  // const [optionList, setOptionList] = useState();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});

  const setDefaultOption = (id) => {
    id && setForm_name(id);
  };

  useEffect(() => {
    setForm_name(1);
  }, []);

  return (
    <div className={styles.nav_container}>
      {(tempOptionList || []).map((item, index) => (
        <div
          key={index}
          className={`${styles.list_option} ${
            form_name == item.id ? styles.list_option_active : ""
          }`}
        >
          <div
            onClick={() => {
              if (item.id !== form_name) setLoader(true);
              setDefaultOption(item.id);
            }}
          >
            <WrapText width={200}>{item.name}</WrapText>
          </div>
          {/* <Dropdown
            overlay={
              <Menu
                style={{ width: 100 }}
                onMouseEnter={() => setSelectedOption(item)}
              >
                {item.default ? (
                  <>
                    <Menu.Item key="option1" style={style.dropdown_option}>
                      Edit
                    </Menu.Item>
                    <Menu.Item key="option2" style={style.dropdown_option}>
                      Hide
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item
                      key="option1"
                      style={style.dropdown_option}
                      onClick={() => setCreateModalOpen(true)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      key="option2"
                      style={style.dropdown_option}
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete
                    </Menu.Item>
                  </>
                )}
              </Menu>
            }
          >
            <MoreOutlined className="action-icon" />
          </Dropdown> */}
        </div>
      ))}
      {/* <div
        className={styles.add_button}
        onClick={() => {
          setSelectedOption({});
          setCreateModalOpen(true);
        }}
      >
        <img src={AddButton} alt="add" />
        Add Activity Type
      </div> */}
      {/* <AddCustomActivityType
        {...{ createModalOpen, setCreateModalOpen }}
        data={selectedOption}
      />
      <ConfirmDelete
        title={"Custom Activity Type"}
        open={deleteModalOpen}
        confirmValue={() => {
          handleDeleteCustomer();
        }}
      /> */}
    </div>
  );
};

export default FormNavigateBar;

const style = {
  dropdown_option: {
    color: "#727176",
    fontSize: "12px !important",
    fontWeight: 500,
  },
};

const tempOptionList = [
  { name: "Customer level & type", id: 1, allowCustomFields: false },
  { name: "Business details", id: 2 },
  { name: "Assign", id: 3 },
];
