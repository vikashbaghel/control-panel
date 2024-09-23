import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { getStaffDetails as getStaffDetailsAPI } from "../../redux/action/staffAction";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useNavigate } from "react-router";
import { removeAllCookies } from "../../helpers/globalFunction";

const StaffLogin = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { getStaffDetails } = state;
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");

  const decodeToken = () => {
    const decodedObject = JSON.parse(atob(token));
    return decodedObject;
  };

  useEffect(() => {
    // clearin all cookies and localStorage
    removeAllCookies();

    // saving the imp value for login
    cookies.set("rupyzToken", `Bearer ${decodeToken().token}`, { path: "/" });
    cookies.set("rupyzOrgId", decodeToken().org_id, { path: "/" });
    cookies.set("rupyzUserName", decodeToken().staff_name, { path: "/" });
    cookies.set("rupyzAccessType", "WEB_STAFF", { path: "/" });
    cookies.set("rupyzProfilePic", decodeToken().staff_img || "", {
      path: "/",
    });

    setTimeout(() => {
      dispatch(getStaffDetailsAPI());
    }, 500);
  }, []);

  useEffect(() => {
    if (getStaffDetails.data && !getStaffDetails.data.data.error) {
      navigate("/web");
      window.location.reload();
    }
  }, [state]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Loading..." size="large"></Spin>
    </div>
  );
};

export default StaffLogin;
