import { MoreOutlined } from "@ant-design/icons";
import { Table, Dropdown } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  staffRoleDeleteService,
  staffRolesPermissionAction,
} from "../../redux/action/rolePermissionAction";
import Context from "../../context/Context";
import Cookies from "universal-cookie";
import { DeleteOutlineIcon, EditIcon } from "../../assets/globle";
import Add from "../../assets/add-icon.svg";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import styles from "./staffRole.module.css";

const StaffRolesPermission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const [apiData, setApiData] = useState("");
  const [id, setId] = useState("");
  const { editRoles, setEditRoles, setDeleteModalOpen } = context;
  const cookies = new Cookies();

  useEffect(() => {
    dispatch(staffRolesPermissionAction());
  }, []);

  useEffect(() => {
    if (state.rolesPermission.data !== "") {
      if (state.rolesPermission.data.data.error === false) {
        state.rolesPermission.data.data.data.map((ele) => {
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
        });
        setApiData(state.rolesPermission.data.data.data);
      }
    }
  }, [state]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            navigate(`/web/staff-roles/create-roles?id=${id}`);
            setEditRoles(id);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },

    {
      key: "2",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteOutlineIcon} alt="delete" style={{ width: 14 }} />{" "}
            <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ width: 100, color: "#000", fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (text, record) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {record.permissions?.map((ele, index) => (
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3E6F6",
                borderRadius: 7,
                padding: "5px 10px",
                margin: "2px 4px",
                color: "#000",
                fontSize: 13,
              }}
              key={index}
            >
              {capitalizeFirstLetter(ele)}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setId(record.id);
            setEditRoles(record);
            cookies.set("rupyzStaffRoles", record, {
              path: "/",
            });
          }}
        >
          {record.is_editable === true ? (
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomRight"
            >
              <div className="clickable">
                <MoreOutlined className="action-icon" />
              </div>
            </Dropdown>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const handleDeleteCustomer = (data) => {
    if (data) {
      dispatch(staffRoleDeleteService(editRoles.id));
      setTimeout(() => {
        dispatch(staffRolesPermissionAction());
      }, 500);
    }
  };

  return (
    <>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          background: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p>
            You have to On "Enable Role Permission" from Preferences -{" "}
            <span
              onClick={() => navigate("/web/setting?tab=Preferences")}
              className={styles.prefence_link}
            >
              Preferences
            </span>
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <button
              className="button_primary"
              onClick={() => navigate("/web/staff-roles/create-roles")}
            >
              <img
                src={Add}
                alt="img"
                style={{
                  background: "#fff",
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />{" "}
              Create Role
            </button>
            <div>
              <p style={{ fontWeight: "600", color: "Red", fontSize: "13px" }}>
                You can create 30 roles only (Total Roles - {apiData.length})
              </p>
            </div>
          </div>
        </div>
        <ConfirmDelete
          title={"Role"}
          confirmValue={(data) => {
            handleDeleteCustomer(data);
          }}
        />
        <Table
          pagination={false}
          columns={columns}
          dataSource={apiData !== "" ? apiData : ""}
        />
      </Content>
    </>
  );
};

export default StaffRolesPermission;

const style = {
  icon_edit: {
    color: "green",
    cursor: "pointer",
    fontSize: 15,
  },
  icon_delete: {
    color: "red",
    cursor: "pointer",
    fontSize: 15,
  },
};

export function capitalizeFirstLetter(str) {
  return (
    str &&
    str
      .toLowerCase() // Convert the whole string to lowercase
      .split("_") // Split the string into an array of words based on underscores
      .map(
        (
          word // Map each word
        ) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of each word
      )
      .join(" ")
  );
}
