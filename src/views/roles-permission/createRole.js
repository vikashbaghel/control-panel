import React, { useEffect, useState } from "react";
// import { Content } from "antd/es/layout/layout";
import { Button, Form, Input, Card, Divider, Checkbox } from "antd";
import {
  permissionAction,
  staffRoleAddService,
} from "../../redux/action/rolePermissionAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styles from "./staffRole.module.css";
import Cookies from "universal-cookie";
import { smartRoleArray } from "../../generic/list/smartRoleList";

const CreateNewStaffRole = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const cookies = new Cookies();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [apiData, setApiData] = useState({});
  const [name, setName] = useState("");
  const [checkValue, setCheckValue] = useState([]);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckValue((prev) => [...prev, value]);
      return;
    }
    let tempRolesList = checkValue.filter((ele) => ele !== value);
    setCheckValue(tempRolesList);
  };

  useEffect(() => {
    checkValue.map((ele) => {
      for (let i = 0; i < smartRoleArray.length; i++) {
        if (smartRoleArray[i].action.includes(ele)) {
          if (!checkValue.includes(smartRoleArray[i].result)) {
            setCheckValue((prev) => [...prev, smartRoleArray[i].result]);
          }
        }
      }
    });
  }, [checkValue]);

  const handleSelectAll = (e, permission) => {
    const { checked } = e.target;
    let role = [];
    let roleList = [];
    if (!checked) {
      role = apiData[permission].map((rolesOption, index) => {
        return rolesOption.code;
      });
      roleList = checkValue.filter((item) => !role.includes(item));
      setCheckValue(roleList);
      return;
    }
    role = apiData[permission].map((rolesOption, index) => {
      return rolesOption.code;
    });
    roleList = roleList.concat(role && role);
    let newListTemp = [...new Set([...checkValue, ...roleList])];
    setCheckValue(newListTemp);
  };

  const onFinish = (event) => {
    event.preventDefault();
    const formData = id
      ? { id: id, name: name, permissions: checkValue }
      : { name: name, permissions: checkValue };
    dispatch(staffRoleAddService(formData));
  };

  useEffect(() => {
    dispatch(permissionAction());
    if (id) {
      let incomingstaffRoles = cookies.get("rupyzStaffRoles");
      setName(incomingstaffRoles.name);
      setCheckValue(incomingstaffRoles.permissions);
    }
  }, []);

  useEffect(() => {
    if (state.permissionList.data !== "") {
      if (state.permissionList.data.data.error === false) {
        setApiData(state.permissionList.data.data.data);
      }
    }
    if (state.staffRoleAdd.data !== "") {
      if (state.staffRoleAdd.data.data.error === false) {
        navigate(-1);
      }
    }
  }, [state]);

  return (
    <div>
      <div bordered={false}>
        <form
          name="basic"
          initialValues={{ remember: true }}
          onSubmit={onFinish}
          autoComplete="off"
          style={{ marginTop: "30px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingInline: "35px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",

                display: "flex",
                alignItems: "center",
              }}
            >
              <label style={{ fontWeight: "bold" }}>Roles :</label>&nbsp;&nbsp;
              <input
                name="name"
                style={{ width: "250px" }}
                placeholder="Enter the Role Name"
                onChange={(e) => setName(e.target.value)}
                minLength="3"
                maxLength="20"
                onKeyPress={(e) => {
                  if (!/[A-Za-z ]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                value={name}
                required
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button className="button_primary" htmlType="submit">
                Update
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
              justifyContent: "space-between",
              flexWrap: "wrap",
              margin: "0 36px",
            }}
          >
            {apiData !== ""
              ? Object.keys(apiData).map((permission, index) => {
                  apiData[permission].map((rolesOption, index) => {
                    apiData[permission][index]["isChecked"] = false;
                  });
                  return (
                    apiData[permission].length > 0 && (
                      <Card
                        key={index}
                        style={{ width: "30%" }}
                        bordered={false}
                      >
                        <h3
                          style={{
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {permission}{" "}
                          <div
                            style={{
                              fontWeight: 700,
                              position: "relative",
                              fontSize: 12,
                              fontWeight: 600,
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              name="permissions"
                              id="flexCheckDefault"
                              onChange={(e) => handleSelectAll(e, permission)}
                            />
                            &nbsp; &nbsp; &nbsp;
                            <span style={{ fontSize: 14 }}>Select All</span>
                          </div>{" "}
                        </h3>

                        <Divider />
                        {apiData[permission].map((rolesOption, index) => {
                          return (
                            <div className={styles.checkList_group} key={index}>
                              <Checkbox
                                name="permissions"
                                value={rolesOption.code}
                                checked={checkValue.includes(rolesOption.code)}
                                id="flexCheckDefault"
                                onChange={handleChange}
                              />
                              <div>{rolesOption.name}</div>
                            </div>
                          );
                        })}
                      </Card>
                    )
                  );
                })
              : ""}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewStaffRole;
