import React, { useContext, useEffect, useState } from "react";
import { Layout, theme, Tooltip } from "antd";
import Context from "../../context/Context";
import user from "../../assets/avatar.png";
import CartIcon from "../../assets/cart.svg";
import NotificationIcon from "../../assets/notification.svg";
import DropdownIcon from "../../assets/arrow_drop_down.svg";
import styles from "./topNavbar.module.css";
import { accessType, org_id, userName } from "../../config";
import { useNavigate } from "react-router";
import ProfileView from "../viewDrawer/profileViewUpdate";
import Cookies from "universal-cookie";
import logOutFun from "../../helpers/deleteCookies";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../notification";
import Company from "../../assets/navbar-company.svg";
import Setting from "../../assets/navbar-setting.svg";
import Logout from "../../assets/navbar-logout.svg";
import {
  editProfileDetailsService,
  editStaffProfileDetailsService,
  profileAction,
  profileDetailsAction,
  staffProfileDetailsAction,
} from "../../redux/action/profileAction";

import iconId from "../../assets/id-icon.svg";
import iconMobile from "../../assets/mobile-icon.svg";
import iconEmail from "../../assets/mail-icon.svg";
import IconCamera from "../../assets/cemra.svg";
import User from "../../assets/user.svg";
import { ArrowLeft, EditIcon } from "../../assets/globle";
import { ReminderIcon } from "../../assets/navbarImages";
import Reminder from "../reminder";
import { getStaffDetails } from "../../redux/action/staffAction";
import { uploadImage } from "../image-uploader/ImageUploader";
import cartService from "../../services/cart-service";

const { Header } = Layout;
const cookies = new Cookies();

const TopNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  const context = useContext(Context);
  const {
    cartNumber,
    setCartNumber,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    reminderIsOpen,
    setReminderIsOpen,
  } = context;
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [orgId, setOrgId] = useState(cookies.get("rupyzOrgId"));
  const [profileDetails, setProfileDetails] = useState([]);
  const [userProfileDetails, setUserProfileDetails] = useState([]);

  const [profileDetailOpen, setProfileDetailOpen] = useState(false);
  const [prodileViewOpen, setProdileViewOpen] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  let org_profile_image = JSON.parse(localStorage.getItem("rupyzOrgLogoImage"));
  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  useEffect(() => {
    if (state.getNotification.data !== "") {
      if (state.getNotification.data.data.error === false) {
        setNotificationCount(state.getNotification.data.data.data.unread_count);
      }
    }
    if (state.getStaffDetails.data !== "") {
      if (state.getStaffDetails.data.data.error === false)
        setProfileDetails(state.getStaffDetails.data.data.data);
    }
    // if (state.profile.data !== "") {
    //   if (state.profile.data.data.error === false)
    //     setProfileDetails(state.profile.data.data.data);
    // }
    if (state.profileDetails.data !== "") {
      if (state.profileDetails.data.data.error === false)
        setUserProfileDetails(state.profileDetails.data.data.data);
    }
    if (
      state.staffProfileDetails.data !== "" &&
      state.staffProfileDetails.data.data.error === false
    ) {
      setUserProfileDetails(state.staffProfileDetails.data.data.data);
    }
  }, [state]);

  const handleChange = (value) => {
    setOrgId(value.id);
    cartService.clearCart();
    cookies.set("rupyzOrgId", value.id, { path: "/" });
    cookies.set("rupyzUserName", value.legal_name, { path: "/" });
    window.location.replace("/web");
  };

  useEffect(() => {
    if (!isProfileDropdownOpen) {
      setTimeout(() => {
        setProdileViewOpen(false);
        setProfileDetailOpen(false);
      }, 500);
    }
  }, [isProfileDropdownOpen]);

  let orgImage = admin
    ? profileDetails.org_ids
        ?.filter((ele) => ele.id == org_id)
        .map((data) => data.logo_image_url)[0]
    : profileDetails.logo_image;

  useEffect(() => {
    dispatch(getStaffDetails());
    setCartNumber((cartService.fetchCart() || []).length);
  }, []);

  return (
    <Header
      style={{
        background: colorBgContainer,
      }}
      className={styles.navbar_container}
    >
      <div className={styles.logo_container} onClick={() => navigate("/")}>
        {orgImage || org_profile_image ? (
          <div style={{ paddingLeft: 20 }}>
            <img
              src={orgImage ? orgImage : org_profile_image}
              alt="img"
              onClick={() => {
                setIsProfileDropdownOpen(false);
                setReminderIsOpen(false);
                setIsNotificationOpen(false);
                navigate("/web");
              }}
              className="clickable"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.profile_container}>
        <div
          className={styles.cart_container}
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setReminderIsOpen(false);
            setIsNotificationOpen(false);
          }}
        >
          <img
            src={CartIcon}
            alt="img"
            className="clickable"
            onClick={() => navigate("/web/distributor/product-list/cart")}
          />
          {cartNumber ? (
            <div
              className={styles.cart_count}
              onClick={() => navigate("/web/distributor/product-list/cart")}
            >
              {cartNumber}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.reminder_container}>
          <img
            src={ReminderIcon}
            alt="reminder"
            className="clickable"
            onClick={() => {
              setReminderIsOpen(!reminderIsOpen);
              setIsNotificationOpen(false);
              setIsProfileDropdownOpen(false);
            }}
          />
          {reminderCount !== 0 ? (
            <div
              className={styles.reminder_count}
              onClick={() => {
                setReminderIsOpen(!reminderIsOpen);
                setIsNotificationOpen(false);
              }}
            >
              {reminderCount > 999 ? "999+" : reminderCount}
            </div>
          ) : (
            <></>
          )}
          <div>
            <Reminder
              isOpen={reminderIsOpen}
              count={(number) => setReminderCount(number)}
            />
          </div>
        </div>
        <div className={styles.notification_container}>
          <img
            src={NotificationIcon}
            alt="img"
            className="clickable"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setReminderIsOpen(false);
              setIsProfileDropdownOpen(false);
            }}
          />
          {notificationCount !== 0 ? (
            <div
              className={styles.notification_count}
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setReminderIsOpen(false);
              }}
            >
              {notificationCount > 999 ? "999+" : notificationCount}
            </div>
          ) : (
            <></>
          )}
          <div>
            <Notification isNotificationOpen={isNotificationOpen} />
          </div>
        </div>

        <div
          onClick={() => {
            setIsNotificationOpen(false);
            setReminderIsOpen(false);
            setIsProfileDropdownOpen(!isProfileDropdownOpen);
          }}
          className={styles.user_profile}
        >
          <img
            src={
              profileDetails.profile_pic_url
                ? profileDetails.profile_pic_url
                : user
            }
            alt="img"
            className={styles.user_img}
          />
          <div>
            {userName}
            <div className={styles.user_name_container}>
              <div>{admin ? "Admin" : "Staff"}</div>
              <img
                src={DropdownIcon}
                alt="img"
                className={`${
                  isProfileDropdownOpen
                    ? styles.dropdown_icon_active
                    : styles.dropdown_icon
                }`}
                width={30}
                height={30}
              />
            </div>
          </div>
        </div>

        <div
          className={`${styles.dropdown_container} ${
            isProfileDropdownOpen ? styles.active : ""
          }`}
          style={
            profileDetailOpen || prodileViewOpen
              ? { width: 350 }
              : { width: 250 }
          }
        >
          {profileDetailOpen ? (
            <ProfileDetails back={(data) => setProfileDetailOpen(data)} />
          ) : prodileViewOpen ? (
            <ProfileViewDetails back={(data) => setProdileViewOpen(data)} />
          ) : (
            <ul
              onFocus={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
              }}
            >
              <li
                className="clickable"
                style={{ borderRadius: 5 }}
                onClick={() => setProfileDetailOpen(true)}
              >
                <img
                  src={
                    profileDetails.profile_pic_url
                      ? profileDetails.profile_pic_url
                      : user
                  }
                  alt="img"
                />{" "}
                Your Profile
              </li>
              {accessType === "WEB_SARE360" ? (
                <li
                  className="clickable"
                  style={{ borderRadius: 5 }}
                  onClick={() => setProdileViewOpen(true)}
                >
                  <img src={Company} alt="img" /> Organization Profile
                </li>
              ) : (
                <></>
              )}
              <li
                className="clickable"
                style={{ borderRadius: 5 }}
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  navigate("/web/profile-settings");
                }}
              >
                <img src={Setting} alt="img" />
                Profile Settings
              </li>
              {accessType === "WEB_SARE360" ? (
                <>
                  <div className={styles.org_list_cantainer}>
                    {localStorage.getItem("rupyzOrgList") &&
                      JSON.parse(localStorage.getItem("rupyzOrgList")).map(
                        (data, index) => {
                          let checked = data.id === parseInt(orgId);
                          return (
                            <Tooltip
                              placement="left"
                              title={data.legal_name}
                              key={index}
                            >
                              <li
                                key={index}
                                className={checked ? styles.active_org : ""}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleChange(data)}
                              >
                                <span className={styles.org_list}>
                                  {data.legal_name}
                                </span>
                              </li>
                            </Tooltip>
                          );
                        }
                      )}
                  </div>
                </>
              ) : (
                <></>
              )}
              <li
                className="clickable"
                onClick={() => {
                  logOutFun();
                }}
              >
                <img src={Logout} alt="img" />
                Log Out
              </li>
            </ul>
          )}
        </div>
      </div>

      <ProfileView />
    </Header>
  );
};

export default TopNavbar;

const ProfileDetails = ({ back }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [apiData, setApiData] = useState("");
  const [staffData, setStaffData] = useState("");
  const [imgs, setImg] = useState();
  const [iconImageId, setIconImageId] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState("");

  const isAdmin = accessType === "WEB_SARE360";

  useEffect(() => {
    dispatch(profileDetailsAction());
    dispatch(staffProfileDetailsAction());
  }, []);

  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    setImg(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (state.profileDetails.data !== "") {
      if (state.profileDetails.data.data.error === false) {
        setApiData(state.profileDetails.data.data.data);
        localStorage.setItem(
          "rupyzProfileImage",
          JSON.stringify(state.profileDetails.data.data.data.profile_pic_url)
        );
      }
    }
    if (state.staffProfileDetails.data !== "") {
      if (state.staffProfileDetails.data.data.error === false) {
        setStaffData(state.staffProfileDetails.data.data.data);
        cookies.set(
          "rupyzPermissionType",
          state.staffProfileDetails.data.data.data.permissions,
          { path: "/" }
        );

        localStorage.setItem(
          "rupyzProfileImage",
          JSON.stringify(
            state.staffProfileDetails.data.data.data.profile_pic_url
          )
        );
        localStorage.setItem(
          "rupyzOrgLogoImage",
          JSON.stringify(state.staffProfileDetails.data.data.data.logo_image)
        );
      }
    }
  }, [state]);

  const uploadImageToServer = async () => {
    if (imgs) {
      const res = await uploadImage([imgs]);
      if (res.length) {
        if (isAdmin) {
          dispatch(editProfileDetailsService({ profile_pic: res[0] }));
        } else
          dispatch(editStaffProfileDetailsService({ profile_pic: res[0] }));
        setTimeout(() => {
          dispatch(getStaffDetails());
        }, 500);
        setIconImageId(res[0]);
      }
    }
  };

  return (
    <div className={styles.profile_view_container}>
      <div className={styles.profile_header}>
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => back(false)}
          style={{ cursor: "pointer" }}
        />
        <div style={{ fontSize: 16, fontWeight: 600 }}>Profile</div>
      </div>
      <div className={styles.profile_body}>
        <div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageUpload}
            ref={imageUploader}
            style={{
              display: "none",
              border: "none",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "relative",
              height: "120px",
              width: "120px",
              borderRadius: "50%",
              border: "1px dashed ",
              margin: "auto",
            }}
            onClick={() => imageUploader.current.click()}
          >
            <img
              ref={
                uploadedImage ||
                apiData?.profile_pic_url ||
                staffData?.profile_pic_url
              }
              src={
                apiData?.profile_pic_url || staffData?.profile_pic_url || User
              }
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                position: "absolute",

                left: "66%",
                top: "70%",
              }}
            >
              <img
                src={IconCamera}
                alt="upload"
                style={{
                  width: 40,
                  padding: 7,
                  background: "#fff",
                  border: "1px solid",
                  borderRadius: "25px",
                  cursor: "pointer",
                }}
              />
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              type="primary"
              className="button_primary form-control btn btn-primary mt-20"
              disabled={iconImageId}
              onClick={uploadImageToServer}
            >
              {" "}
              <i
                className={`bx ${
                  isLoadingFile === "feature" ? "bx-loader bx-spin" : null
                } font-size-16 align-middle me-2`}
              ></i>
              {iconImageId ? (
                <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
              ) : null}
              {iconImageId ? "Uploaded" : "Upload"}
            </button>
          </div>
        </div>
        <div className={styles.header_top}>
          {isAdmin ? apiData.first_name + apiData.last_name : staffData.name}
        </div>
        {!isAdmin && (
          <div
            style={{
              textAlign: "center",
              lineHeight: "15px",
              paddingBottom: "1em",
            }}
          >
            ({staffData.roles})
          </div>
        )}
        <div className={styles.header_bottom}>
          {isAdmin ? userName : staffData.org_name}{" "}
        </div>
        <div className={styles.list_group}>
          {(isAdmin || staffData.employee_id) && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "start",
                wordBreak: "break-all",
              }}
            >
              <img src={iconId} alt="id-card" height={40} />
              <div>{isAdmin ? apiData.rupyz_id : staffData.employee_id} </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "start",
              wordBreak: "break-all",
            }}
          >
            <img src={iconMobile} alt="mobile" height={40} />
            <div>{isAdmin ? apiData.mobile : staffData.mobile}</div>
          </div>
          {(isAdmin || staffData.email) && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "start",
                wordBreak: "break-all",
              }}
            >
              <img src={iconEmail} alt="email" height={40} />
              <div>{isAdmin ? apiData.email : staffData.email}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileViewDetails = ({ back }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { profile } = state;
  const context = useContext(Context);
  const { setProfileViewUpdateOpenOpen } = context;

  const [profileDetails, setProfileDetails] = useState("");
  const [activeProfileDetailsView, setActiveProfileDetailsView] =
    useState("General");

  const isAdmin = accessType === "WEB_SARE360";

  useEffect(() => {
    dispatch(profileAction());
  }, []);

  useEffect(() => {
    if (profile.data && !profile.data.data.error) {
      const data = profile.data.data.data;
      const details = {
        General: {
          Logo: data.logo_image_url,
          GST: data.primary_gstin,
          "Company Name": data.legal_name,
          Mobile: data.mobile,
          Mail: data.email,
          Address: data.address_line_1,
          City: data.city,
          State: data.state,
          Pincode: data.pincode,
          "First Name": data.first_name,
          "Last Name": data.last_name,
        },
        "Bank Details": {
          "Bank Name": data.bank_detail.name,
          "Bank Address": data.bank_detail.address,
          "Account No.": data.bank_detail.account_number,
          "IFSC Code": data.bank_detail.ifsc_code,
          "SWIFT Code": data.bank_detail.swift_code,
          "Qr Code": data.bank_detail.qr_code_url,
        },
      };
      setProfileDetails(details);
    }
  }, [state]);

  return (
    <div>
      <div className={styles.profile_view_header}>
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => back(false)}
          style={{ cursor: "pointer" }}
        />
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          Organization Profile
        </div>
      </div>
      {isAdmin && (
        <div className={styles.profile_view_tabs}>
          {["General", "Bank Details"].map((ele) => (
            <div
              className={
                activeProfileDetailsView === ele &&
                styles.active_profile_view_tab
              }
              style={{ flex: 1, fontWeight: 500 }}
              onClick={() => setActiveProfileDetailsView(ele)}
            >
              {ele}
            </div>
          ))}
        </div>
      )}
      <div className={styles.profile_view_list}>
        <button
          onClick={() => setProfileViewUpdateOpenOpen(activeProfileDetailsView)}
          className="button_secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            position: "absolute",
            right: 20,
          }}
        >
          <img src={EditIcon} alt="edit" width={17} /> Edit
        </button>

        {Object.keys(profileDetails[activeProfileDetailsView] || {})?.map(
          (ele) => (
            <div>
              <div style={{ color: "#727176" }}>{ele}</div>
              {["Logo", "Qr Code"].includes(ele) ? (
                profileDetails[activeProfileDetailsView][ele] ? (
                  <img
                    src={profileDetails[activeProfileDetailsView][ele]}
                    alt={ele}
                    width={200}
                    style={{ paddingTop: 8 }}
                  />
                ) : (
                  <code>---</code>
                )
              ) : (
                <div style={{ fontWeight: 600 }}>
                  {profileDetails[activeProfileDetailsView][ele] || (
                    <code>---</code>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
