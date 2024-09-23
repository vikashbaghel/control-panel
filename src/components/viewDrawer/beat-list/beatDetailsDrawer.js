import WrapText from "../../wrapText";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import CustomersList from "./customersList";
import Context from "../../../context/Context";
import { useNavigate } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
import { Divider, Drawer, Dropdown } from "antd";
import AssignedStaffList from "./assignedStaffList";
import { useDispatch, useSelector } from "react-redux";
import mapIcon from "../../../assets/map-pin-blue.svg";
import { useContext, useEffect, useState } from "react";
import filterService from "../../../services/filter-service";
import ConfirmDelete from "../../confirmModals/confirmDelete";
import leftArrow from "../../../assets/globle/arrow-left.svg";
import { DeleteIcon, EditIcon } from "../../../assets/globle";
import staffIcon from "../../../assets/navbarImages/staff.svg";
import { beatDetailsService } from "../../../redux/action/beatAction";
import { deleteCustomer } from "../../../redux/action/customerAction";
import customerParentIcon from "../../../assets/staffImages/MeetingIcon.svg";
import TranferPopupConfirmation from "../../../views/distributor/tranferPopup";

export default function BeatDetailsDrawer({ id }) {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);

  const state = useSelector((state) => state);
  const { getBeatDetails, editBeat } = state;

  const context = useContext(Context);
  const {
    setLoading,
    setAddBeatOpen,
    setDeleteModalOpen,
    setOpenDistributorDrawer,
    distributorDetails,
  } = context;

  const beatId = queryParams.get("id");
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const items = [
    {
      key: "1",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => {
            filterService.setFilters({
              edit_id: beatDetails?.id,
            });
            setAddBeatOpen(true);
          }}
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => setDeleteModalOpen(true)}
        >
          <img src={DeleteIcon} alt="delete" />
          Delete
        </div>
      ),
    },
  ];

  // states for handle the beat details
  const [beatDetails, setBeatDetails] = useState();

  const [staffAssignedTab, setStaffAssignedTab] = useState(false);

  // for the customer transfer popup permission
  const [showTranferPopup, setShowTranferPopup] = useState(false);
  const [childCount, setChildCount] = useState();

  // for closing drawer
  const closeDrawer = () => {
    filterService.setFilters({ id: "" });
    setBeatDetails({});
    setStaffAssignedTab(false);
  };

  useEffect(() => {
    if (id && beatId) {
      dispatch(beatDetailsService(beatId));
    }
  }, [beatId]);

  useEffect(() => {
    if (getBeatDetails.data && !getBeatDetails.data.data.error)
      setBeatDetails(getBeatDetails.data.data.data);
    if (editBeat.data && !editBeat.data.data.error && id) {
      setAddBeatOpen(false);
      dispatch(beatDetailsService(beatId));
    }
    if (state.deleteCustomer.data && !state.deleteCustomer.data.data.error) {
      if (!state?.deleteCustomer?.data?.params?.check_children) {
        return;
      } else if (state.deleteCustomer?.data?.data?.data?.is_used) {
        setChildCount(state.deleteCustomer?.data?.data?.data?.child_count);
        setShowTranferPopup(true);
      } else {
        setDeleteModalOpen(true);
      }
    }
    setLoading(false);
  }, [state]);

  return (
    <>
      <Drawer
        open={id}
        onClose={closeDrawer}
        title={
          <div
            style={{
              display: "flex",
              width: staffAssignedTab ? "65%" : "100%",
              justifyContent: staffAssignedTab ? "space-between" : "center",
            }}
          >
            {staffAssignedTab && (
              <img
                src={leftArrow}
                alt="back"
                style={{ cursor: "pointer" }}
                onClick={() => setStaffAssignedTab(false)}
              />
            )}
            <div style={{ textAlign: "center" }}>
              {staffAssignedTab ? (
                <>
                  <div>Staff Assigned</div>
                  <div style={{ color: "#727176", fontSize: 12 }}>
                    {beatDetails?.name}
                  </div>
                </>
              ) : (
                "Beat Details"
              )}
            </div>
          </div>
        }
        headerStyle={{ borderBottom: "none" }}
        width={550}
        destroyOnClose={true}
      >
        <div className={styles.beat_drawer}>
          {staffAssignedTab ? (
            <AssignedStaffList />
          ) : (
            <>
              <div className={`${styles.row} ${styles.bold_black}`}>
                <p>
                  <WrapText width={200}>{beatDetails?.name}</WrapText>
                </p>
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
              {beatDetails?.locality && (
                <div
                  className={styles.flex_5}
                  style={{ wordBreak: "break-word" }}
                >
                  <img src={mapIcon} alt="pin" className={styles.blue_filter} />{" "}
                  {beatDetails?.locality}
                </div>
              )}
              <div className={styles.row}>
                <div className={styles.flex_5}>
                  <img src={customerParentIcon} alt="customer" />{" "}
                  {beatDetails?.parent_customer_level
                    ? customerLevelList[beatDetails?.parent_customer_level]
                    : "Parent"}
                </div>
                <p className={styles.bold_blue}>
                  {beatDetails?.parent_customer_name ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setOpenDistributorDrawer(true);
                        navigate(
                          `/web/customer?id=${beatDetails?.parent_customer}`
                        );
                      }}
                    >
                      <WrapText width={200}>
                        {beatDetails?.parent_customer_name}
                      </WrapText>
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => {
                        filterService.setFilters({
                          edit_id: beatDetails?.id,
                        });
                        setAddBeatOpen(true);
                      }}
                    >
                      Add Parent +
                    </span>
                  )}
                </p>
              </div>
              <Divider
                style={{
                  background: "#fff",
                  height: 2,
                  borderColor: "#fff",
                  margin: 0,
                }}
              />
              <div className={styles.row}>
                <div className={styles.flex_5}>
                  <img
                    src={staffIcon}
                    alt="staff"
                    className={styles.blue_filter}
                    width={24}
                  />
                  Staff Assigned
                </div>
                <p className={styles.bold_blue} style={{ cursor: "pointer" }}>
                  {beatDetails?.staff_count > 0 ? (
                    <span onClick={() => setStaffAssignedTab(true)}>
                      {beatDetails?.staff_count +
                        (beatDetails?.staff_count > 1 ? " staffs" : " staff")}
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => {
                        filterService.setFilters({
                          edit_id: beatDetails?.id,
                        });
                        setAddBeatOpen(true);
                      }}
                    >
                      Assign Staff +
                    </span>
                  )}
                </p>
              </div>
              <Divider
                style={{
                  background: "#fff",
                  height: 2,
                  borderColor: "#fff",
                  margin: 0,
                }}
              />

              <CustomersList
                parent_id={beatDetails?.parent_customer}
                beat_id={beatDetails?.id}
                isDrawerOpen={id}
                onClose={closeDrawer}
              />
              <ConfirmDelete
                title="Customer"
                confirmValue={(data) => {
                  if (data) {
                    dispatch(
                      deleteCustomer(distributorDetails?.id, false, {
                        check_children: false,
                      })
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      </Drawer>

      <TranferPopupConfirmation
        isOpen={showTranferPopup}
        onChange={(e) => {
          setShowTranferPopup(e?.toggle);
        }}
        details={{ ...distributorDetails, childCount }}
      />
    </>
  );
}
