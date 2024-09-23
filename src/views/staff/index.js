import { Dropdown, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import {
  staffDeleteService,
  staffService,
} from "../../redux/action/staffAction";
import { useNavigate } from "react-router";
import Permissions from "../../helpers/permissions";
import Add from "../../assets/add-icon.svg";
import styles from "./staff.module.css";
import { DeleteIcon, EditIcon, ViewIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { Staff as StaffIcon } from "../../assets/dashboardIcon";
import AdminLayout from "../../components/AdminLayout";
import Paginator from "../../components/pagination";
import filterService from "../../services/filter-service";

const Staff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const context = useContext(Context);
  const {
    setNewResponse,
    setDeleteModalOpen,
    deleteModalOpen,
    newResponse,
    setLoading,
  } = context;

  const state = useSelector((state) => state);

  const [apiData, setApiData] = useState([]);
  const [id, setId] = useState("");
  const [activeParams, setActiveParams] = useState({
    page: 1,
    ...filterService.getFilters(),
  });

  let viewStaffPermission = Permissions("VIEW_STAFF");
  let createStaffPermission = Permissions("CREATE_STAFF");
  let editStaffPermission = Permissions("EDIT_STAFF");
  let deactivateStaffPermission = Permissions("DEACTIVATE_STAFF");

  useEffect(() => {
    if (
      state.staff.data !== "" &&
      !state.staff.data.data.error &&
      state.staff.data.data.data.length !== undefined
    ) {
      setApiData(state.staff.data.data.data);
    }
    if (state.staffDelete.data !== "") {
      if (state.staffDelete.data.data.error === false) {
        setDeleteModalOpen(false);
        navigate("/web/staff");
        dispatch(staffService(activeParams));
      }
    }
    setLoading(false);
  }, [state]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            navigate(
              `/web/staff/view-details/?id=${id}&userid=${newResponse.user}`
            );
          }}
          className="action-dropdown-list"
        >
          <img src={ViewIcon} alt="edit" /> View Details
        </div>
      ),
    },
    editStaffPermission
      ? {
          key: "2",
          label: (
            <div
              onClick={() => {
                navigate(`/web/staff/add-staff/?id=${id}`);
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : {},
    deactivateStaffPermission
      ? {
          key: "3",
          label: (
            <>
              <div
                className="action-dropdown-list"
                onClick={() => {
                  setDeleteModalOpen(true);
                }}
              >
                <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
              </div>
            </>
          ),
        }
      : {},
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "300px",
      render: (text, record) => (
        <div
          className={styles.staff_name}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(
              `/web/staff/view-details/?id=${record.id}&userid=${record.user}&staff_level=`
            );
          }}
        >
          <div>
            <img
              src={
                record?.profile_pic_url !== ""
                  ? record?.profile_pic_url
                  : StaffIcon
              }
              alt="img"
              className={styles.profile_icon}
            />
          </div>
          <div style={{ width: "280px", overflow: "hidden" }}>
            {record?.name}
          </div>
        </div>
      ),
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      width: "150px",
    },
    {
      title: "Staff Role",
      dataIndex: "roles",
      width: "300px",
    },
    {
      title: "Mobile No.",
      dataIndex: "mobile",
      width: "150px",
    },
    {
      title: "Email ID ",
      dataIndex: "email",
      width: "250px",
    },
    {
      title: " ",
      dataIndex: "",
      key: "operation",
      width: "50px",
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setId(record.id);
            setNewResponse(record);
            // unused cookie
            // cookies.set("rupyzStaffDetails", JSON.stringify(record), {
            //   path: "/",
            // });
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
            className="action-dropdown"
          >
            <div className="clickable">
              <MoreOutlined className="action-icon" />
            </div>
          </Dropdown>
        </div>
      ),
    },
  ];

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      id !== "" && dispatch(staffDeleteService(id, false));
      setTimeout(() => {
        dispatch(staffService(activeParams));
      }, 400);
    }
  };

  if (!apiData || !Array.isArray(apiData)) {
    // Handle cases where rawData is empty or not an array
    setLoading(true);
  }

  useEffect(() => {
    dispatch(staffService(activeParams));
  }, [activeParams]);

  useEffect(() => {
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <AdminLayout
      title="Staff List"
      search={{
        placeholder: "search for a staff",
        searchValue: (data) => filterService.setFilters({ query: data }),
      }}
      panel={[
        ...(createStaffPermission
          ? [
              <button
                className="button_primary"
                onClick={() => {
                  navigate("/web/staff/add-staff");
                }}
              >
                <img src={Add} alt="img" className={styles.add_icon} /> Add
                Staff
              </button>,
            ]
          : []),
      ]}
    >
      {(viewStaffPermission ||
        createStaffPermission ||
        editStaffPermission ||
        deactivateStaffPermission) && (
        <Table
          columns={columns}
          dataSource={apiData}
          pagination={false}
          scroll={{ y: 500 }}
        />
      )}
      <br />
      <br />
      <Paginator
        limiter={(apiData || []).length < 30}
        value={activeParams["page"]}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <ConfirmDelete
        title={"Staff"}
        open={deleteModalOpen}
        confirmValue={(rowData) => {
          handleDeleteCustomer(rowData);
          setDeleteModalOpen(rowData);
        }}
      />
    </AdminLayout>
  );
};

export default Staff;
