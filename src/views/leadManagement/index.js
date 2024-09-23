import { Dropdown, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Context from "../../context/Context";
import {
  deleteLead as deleteLeadAPI,
  leadAction,
  updateLeadStatus,
} from "../../redux/action/leadManagementAction";
import { MoreOutlined } from "@ant-design/icons";
import Permissions from "../../helpers/permissions";
import Cookies from "universal-cookie";
import Add from "../../assets/add-icon.svg";
import Styles from "./lead.module.css";
import { DeleteIcon, EditIcon, StoreFrontIcon } from "../../assets/globle";
import { ViewDetails } from "../../assets";
import { LeadConvertIcon } from "../../assets/navbarImages";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import ConfirmApprove from "../../components/confirmModals/confirmApprove";
import RejectReasonModal from "../../helpers/rejectReason";
import moment from "moment";
import { BASE_URL_V2, org_id } from "../../config";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";
import Paginator from "../../components/pagination";
import filterService from "../../services/filter-service";
import getValidAddress from "../../helpers/validateAddress";
import AdminLayout from "../../components/AdminLayout";
import RecordActivityComponent from "../../components/activityModal/recordActivity";

const LeadManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { deleteLead } = state;
  const context = useContext(Context);
  const {
    recordLeadActivityData,
    setRecordLeadActivityData,
    deleteModalOpen,
    setDeleteModalOpen,
    setIsConfirmApproveOpen,
    setShowRejectReason,
    setLoading,
    setAttendanceModalAction,
  } = context;
  const cookies = new Cookies();
  const staff_id = parseFloat(cookies.get("rupyzLoginData")?.user_id);

  const [leadStatusId, setLeadStatusId] = useState("");
  const [id, setId] = useState("");
  const [leadList, setLeadList] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    page: 1,
    ...filterService.getFilters(),
  });
  const [editActivityData, setEditActivityData] = useState({});

  let viewLeadPermission = Permissions("VIEW_LEAD");
  let createLeadPermission = Permissions("CREATE_LEAD");
  let editLeadPermission = Permissions("EDIT_LEAD_CATEGORY");
  let deleteLeadPermission = Permissions("DELETE_LEAD");
  let approveLeadPermission = Permissions("APPROVE_LEAD");
  let selfApproveLeadPermission = Permissions("APPROVE_SELF_LEAD");

  const handleStatusChange = (value, id) => {
    setLeadStatusId(id);
    if (value === "Rejected") {
      setShowRejectReason(true);
      return;
    }
    setIsConfirmApproveOpen(true);
  };

  const handleUpdateStatus = () => {
    setTimeout(() => {
      dispatch(leadAction(activeFilters));
    }, 500);
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            navigate(`/web/view-lead/?id=${id}`);
          }}
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    recordLeadActivityData.status === "Approved" && {
      key: "2",
      label: (
        <div
          onClick={() => {
            navigate(`/web/customer/add-customer/?type=lead&lead_id=${id}`);
          }}
          className="action-dropdown-list"
        >
          <img src={LeadConvertIcon} alt="activies" />
          Convert to Customer
        </div>
      ),
    },
    editLeadPermission &&
      (recordLeadActivityData.status === "Pending" ||
        recordLeadActivityData.status === "Approved") && {
        key: "3",
        label: (
          <div
            onClick={() => {
              navigate(`/web/add-lead/?id=${id}`);
            }}
            className="action-dropdown-list"
          >
            <img src={EditIcon} alt="edit" /> Edit
          </div>
        ),
      },
    deleteLeadPermission && {
      key: "4",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Business Name",
      dataIndex: "business_name",
      render: (text, record) => (
        <>
          <div
            style={{ color: "black", fontWeight: "600", cursor: "pointer" }}
            onClick={() => {
              navigate(`/web/view-lead/?id=${record.id}`);
            }}
          >
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
          </div>
          {record.source === "STOREFRONT" && (
            <Tooltip
              placement="top"
              title={"This Lead was generated in Storefront"}
            >
              <div
                style={{ display: "flex", alignItems: "center", fontSize: 12 }}
              >
                <img src={StoreFrontIcon} alt="img" width={17} />
                <div>Storefront</div>
              </div>
            </Tooltip>
          )}
        </>
      ),
      key: "business_name",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person_name",
      render: (text, record) => (
        <>
          <div
            style={{ color: "black", fontWeight: "600", cursor: "pointer" }}
            onClick={() => {
              navigate(`/web/view-lead/?id=${record.id}`);
            }}
          >
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
          </div>
        </>
      ),
      key: "contact_name",
    },
    {
      title: "Lead Category",
      dataIndex: "lead_category_name",
      key: "lead_category",
      with: "250px",
    },
    {
      title: "Location",
      dataIndex: "",
      key: "location",
      render: (record, text) =>
        getValidAddress({ city: record.city, state: record.state }),
    },
    {
      title: "Created by",
      dataIndex: "created_by_name",
      key: "created_by_name",
      align: "center",
    },
    {
      title: "Created at",
      dataIndex: "",
      key: "created_at",
      render: (record, text) => (
        <div>{moment(record.created_at).format("DD-MMM-YYYY")}</div>
      ),
      align: "center",
    },
    {
      title: "Record Activity",
      dataIndex: "",
      key: "created_at",
      render: (record, text) =>
        record.status === "Converted To Customer" ||
        record.status === "Rejected" ? (
          <></>
        ) : (
          <button
            className="tertiary-button"
            onClick={() => {
              setAttendanceModalAction({
                open: true,
                handleAction: () => {
                  setEditActivityData({
                    module_type: "Lead Feedback",
                    module_id: record.id,
                  });
                },
              });
            }}
          >
            Record Activity
          </button>
        ),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "",
      key: "status",
      align: "center",
      render: (record, text) =>
        (selfApproveLeadPermission && staff_id === record.created_by) ||
        (approveLeadPermission && staff_id !== record.created_by) ? (
          record.status.toLowerCase() === "pending" ? (
            <div
              onMouseOver={() => {
                setId(record.id);
              }}
            >
              <select
                style={{ fontSize: 14, width: 120, textAlign: "center" }}
                placeholder={record.status}
                onChange={(e) => handleStatusChange(e.target.value, record.id)}
              >
                <option value="">Pending</option>
                <option value="Approved">Approve</option>
                <option value="Rejected">Reject</option>
              </select>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #fff",
                borderRadius: 5,
                background:
                  record.status === "Approved"
                    ? "#EEFDF3"
                    : record.status === "Rejected"
                    ? "linear-gradient(126deg, #F9D9DA 0%, rgba(248, 218, 218, 0.70) 100%)"
                    : record.status === "Pending"
                    ? "rgb(254, 248, 241)"
                    : "#fff",
                color:
                  record.status === "Approved"
                    ? "#288948"
                    : record.status === "Rejected"
                    ? "#F00"
                    : record.status === "Pending"
                    ? "rgb(241, 162, 72)"
                    : "#ccc",
                padding: 5,
                width: 120,
                margin: "auto",
              }}
            >
              {record.status}
            </div>
          )
        ) : (
          <div
            style={{
              border: "1px solid #fff",
              borderRadius: 5,
              background:
                record.status === "Approved"
                  ? "#EEFDF3"
                  : record.status === "Rejected"
                  ? "linear-gradient(126deg, #F9D9DA 0%, rgba(248, 218, 218, 0.70) 100%)"
                  : record.status === "Pending"
                  ? "rgb(254, 248, 241)"
                  : "#fff",
              color:
                record.status === "Approved"
                  ? "#288948"
                  : record.status === "Rejected"
                  ? "#F00"
                  : record.status === "Pending"
                  ? "rgb(241, 162, 72)"
                  : "#ccc",
              padding: 5,
              width: 120,
              margin: "auto",
            }}
          >
            {record.status}
          </div>
        ),
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            cookies.set("leadData", record, { path: "/" });
            setId(record.id);
            setRecordLeadActivityData(record);
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

  const handleDeleteProduct = (data) => {
    if (data) {
      dispatch(deleteLeadAPI(id));
    }
  };
  const callingLeadActionAPI = () => {
    dispatch(leadAction(activeFilters));
  };

  useEffect(() => {
    callingLeadActionAPI();
  }, [activeFilters]);

  useEffect(() => {
    if (state.leadList.data !== "") {
      if (state.leadList.data.data.error === false) {
        setLeadList(state.leadList.data.data.data);
        setLoading(false);
      }
    }
    if (deleteLead.data && !deleteLead.data.data.error) {
      callingLeadActionAPI();
    }
  }, [state]);

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  const LeadcategoryListAPI = `${BASE_URL_V2}/organization/${org_id}/leadcategory/`;

  return (
    <>
      <AdminLayout
        title="Lead"
        search={{
          placeholder: "Search for lead",
          searchValue: (data) =>
            filterService.setFilters({
              query: data,
            }),
        }}
        panel={[
          <div style={{ width: 250 }}>
            <SingleSelectSearch
              apiUrl={LeadcategoryListAPI}
              value={activeFilters["category"] || undefined}
              onChange={(data) => {
                filterService.setFilters({ category: data?.name });
              }}
              params={{
                placeholder: "All Categories",
              }}
            />
          </div>,
          ...(createLeadPermission
            ? [
                <button
                  className="button_primary"
                  type="primary"
                  onClick={() => {
                    navigate("/web/add-lead");
                    setId("");
                  }}
                >
                  <img src={Add} alt="img" className={Styles.add_icon} /> Add
                  New Lead
                </button>,
              ]
            : []),
        ]}
      >
        <Table
          columns={columns}
          {...(viewLeadPermission && {
            pagination: false,
            dataSource: leadList,
            scroll: { y: 500 },
          })}
        />
        <br />
        <br />
        <Paginator
          limiter={(leadList || []).length < 30}
          value={activeFilters["page"]}
          onChange={(i) => {
            filterService.setFilters({ page: i });
          }}
        />
        <ConfirmDelete
          title={"Lead"}
          open={deleteModalOpen}
          confirmValue={(data) => {
            handleDeleteProduct(data);
            setDeleteModalOpen(data);
          }}
        />
        <RejectReasonModal
          submitReason={(reason) => {
            dispatch(updateLeadStatus(leadStatusId, "Rejected", reason));
            handleUpdateStatus();
            setShowRejectReason(false);
          }}
        />
        <ConfirmApprove
          submitReason={() => {
            dispatch(updateLeadStatus(leadStatusId, "Approved"));
            handleUpdateStatus();
            setIsConfirmApproveOpen(false);
          }}
          title={"Lead"}
        />
      </AdminLayout>
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
        }}
      />
    </>
  );
};

export default LeadManagement;
