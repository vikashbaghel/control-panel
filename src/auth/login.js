import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Checkbox, Input, notification, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authLogin, authVarifyOTP } from "../redux/action/authAction";
import logo_color from "../assets/logo-colored.png";
import mobile_img from "../assets/bg.png";
import googleButton from "../assets/google-play-badge.svg";
import styles from "./auth.module.css";
import { Link } from "react-router-dom";
import Context from "../context/Context";
import ContactUsView from "../components/viewDrawer/contactUsView";
import packageInfo from "../../package.json";
import Cookies from "universal-cookie";
import { removeAllCookies } from "../helpers/globalFunction";

function subtractSeconds(date1, date2) {
  if (date1 > date2) {
    [date1, date2] = [date2, date1];
  }
  const timeDifferenceMs = date2.getTime() - date1.getTime();
  const timeDifferenceSeconds = timeDifferenceMs / 1000;
  return timeDifferenceSeconds;
}

const Login = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { setContactUsViewOpen } = context;
  const [username, setUsername] = useState("");
  const [accessType, setAccessType] = useState("staff");
  const [OTP, setOTP] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [formInput, setFormInput] = useState("");
  const [error, setError] = useState("");
  const [selectOrg, setSelectOrg] = useState(false);
  const [org, setOrg] = useState("");
  const [seconds, setSeconds] = useState(0);

  const cookies = new Cookies();

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === "OTP" && !OTP) {
      setError("Please enter the OTP");
      errorRemove();
      return;
    }
    callingAuthAPI(type);
  };
  useEffect(() => {
    removeAllCookies(["auth"]);
  }, []);

  useEffect(() => {
    let interval;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const sendOTP = () => {
    setSeconds(30);
  };

  const resendOTP = () => {
    callingAuthAPI("username");
    sendOTP();
  };

  const callingAuthAPI = (type) => {
    if (!username) {
      setError("Please enter phone number");
      errorRemove();
      return;
    }
    if (!username.match(/^[1-9]\d{9}$/i)) {
      setError("Please enter valid phone number");
      errorRemove();
      return;
    }

    const apiData = {
      username: username,
      access_type: accessType === "admin" ? "WEB_SARE360" : "WEB_STAFF",
    };

    let storedAuthResult = JSON.parse(localStorage.getItem("auth") || "{}");
    let counter = subtractSeconds(
      new Date(),
      new Date(parseInt(storedAuthResult.updated_at))
    );

    if (type === "username") {
      setFormInput(apiData);
      if (username !== storedAuthResult.username || counter > 30) {
        dispatch(authLogin(apiData));
        sendOTP();
      } else {
        setSeconds(parseInt(30 - counter));
        setOtpRef(storedAuthResult.otp_ref);
      }
      return;
    } else if (type === "OTP") {
      const otpApiData = {
        otp: OTP,
        otp_ref: otpRef,
        username: formInput.username,
        access_type: formInput.access_type,
        terms_condition: true,
        is_smart_match: true,
        preferences: {
          WHATSAPP_OTP_IN: true,
        },
      };
      dispatch(authVarifyOTP(otpApiData));
    }
  };

  const errorRemove = () => {
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  useEffect(() => {
    if (state.authLogin.data !== "") {
      if (state.authLogin.data.data.error === false)
        setOtpRef(state.authLogin.data.data.data.otp_ref);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          otp_ref: state.authLogin.data.data.data.otp_ref,
          username,
          updated_at: `${+new Date()}`,
        })
      );
    }
    if (state.authVarifyOTP.data !== "") {
      if (state.authVarifyOTP.data.data.error === false) {
        if (state.authVarifyOTP.data.data.data.access_type === "WEB_SARE360") {
          setSelectOrg(true);
        } else {
          localStorage.removeItem("auth");
          cookies.set(
            "rupyzToken",
            `Bearer ${state.authVarifyOTP.data.data.data.credentials.access_token}`,
            { path: "/" }
          );
          cookies.set("rupyzOrgId", state.authVarifyOTP.data.data.data.org_id, {
            path: "/",
          });
          cookies.set(
            "rupyzUserName",
            state.authVarifyOTP.data.data.data.staff_name,
            { path: "/" }
          );
          cookies.set(
            "rupyzAccessType",
            state.authVarifyOTP.data.data.data.access_type,
            { path: "/" }
          );

          cookies.set(
            "rupyzProfilePic",
            state.authVarifyOTP.data.data.data.profile_pic_url,
            { path: "/" }
          );

          cookies.set("rupyzLoginData", state.authVarifyOTP.data.data.data, {
            path: "/",
          });
          // requestPermission();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    }
  }, [state, org]);

  const handleCheckbox = (e) => {
    setOrg(e.target.value);
  };

  const handleNext = (e) => {
    if (!org)
      return notification.warning({ message: "Please Select an Organization" });
    cookies.set(
      "rupyzToken",
      `Bearer ${state.authVarifyOTP.data.data.data.credentials.access_token}`,
      { path: "/" }
    );
    localStorage.setItem(
      "rupyzOrgList",
      JSON.stringify(state.authVarifyOTP.data.data.data.org_ids)
    );
    cookies.set(
      "rupyzAccessType",
      state.authVarifyOTP.data.data.data.access_type,
      { path: "/" }
    );
    cookies.set(
      "rupyzProfilePic",
      state.authVarifyOTP.data.data.data.profile_pic_url || "",
      { path: "/" }
    );
    cookies.set("rupyzOrgId", org.id, { path: "/" });
    cookies.set("rupyzUserName", org.legal_name, { path: "/" });
    cookies.set("rupyzAdminId", state.authVarifyOTP.data.data.data.user_id, {
      path: "/",
    });
    localStorage.removeItem("auth");
    // requestPermission();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      callingAuthAPI(type);
    }
  };

  return (
    <div className={styles.login_container}>
      {!selectOrg ? (
        <>
          <div>
            <div>
              <img src={logo_color} style={{ margin: 40 }} width="150px" />
              <div className={styles.card}>
                <h3 className={styles.header}>Sign in</h3>
                <form>
                  {otpRef === "" ? (
                    <div>
                      <Input
                        placeholder="Phone Number"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={10}
                        type="mobile"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, "username")}
                      />
                      <Radio.Group
                        style={{ marginTop: 20 }}
                        name="radiogroup"
                        defaultValue="staff"
                        onChange={(e) => setAccessType(e.target.value)}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="admin" style={{ width: 100 }}>
                          Admin
                        </Radio.Button>
                        <Radio.Button style={{ width: 100 }} value="staff">
                          Staff
                        </Radio.Button>
                      </Radio.Group>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => handleSubmit(e, "username")}
                      >
                        Submit
                        {error ? (
                          <p className={styles.error}>{error}</p>
                        ) : (
                          <></>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p style={{ textAlign: "justify" }}>
                        OTP sent to{" "}
                        <span>
                          <b>{username}</b>
                        </span>
                      </p>
                      <Input
                        placeholder="OTP"
                        name="otp"
                        onChange={(e) => setOTP(e.target.value)}
                        maxLength={4}
                        type="mobile"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, "OTP")}
                      />
                      <>
                        {seconds ? (
                          <p>
                            Resend OTP in{" "}
                            <b>
                              <span>
                                {seconds < 10 ? `0${seconds}` : seconds}
                              </span>
                              <span style={{ marginLeft: "4px" }}>seconds</span>
                            </b>
                          </p>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              onClick={resendOTP}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              Resend OTP
                            </p>
                          </div>
                        )}
                      </>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => handleSubmit(e, "OTP")}
                      >
                        Submit
                        {error ? (
                          <p className={styles.error}>{error}</p>
                        ) : (
                          <></>
                        )}
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          setTimeout(() => {
                            window.location.reload();
                          }, 500);
                        }}
                      >
                        Back
                      </Button>
                    </>
                  )}
                  <br />
                  <p style={{ color: "#a3a3a3" }}>
                    Not a Member yet?
                    <span
                      style={{ color: "#1677ff", cursor: "pointer" }}
                      onClick={() => setContactUsViewOpen(true)}
                    >
                      {" "}
                      Book Demo
                    </span>
                  </p>
                </form>
              </div>
            </div>
            <div className={styles.footer}>
              <a href="https://rupyz.com/term-condition/" target="_blank">
                Terms
              </a>
              <a href="https://rupyz.com/privacy-policy" target="_blank">
                Privacy Policy
              </a>
              <Link onClick={() => setContactUsViewOpen(true)}>Contact Us</Link>
            </div>
          </div>
          <div className={styles.image}>
            <div style={{ marginTop: 35 }}>
              <img src={mobile_img} alt="img" width="300px" />
            </div>
            <div className={styles.google_play_buton}>
              <a
                target="_blank"
                href="https://bit.ly/rupyz-android"
                className={styles.playstore_button}
              >
                <img src={googleButton} alt="img" />
              </a>
            </div>
            <h3>Accelerate B2B sales & distribution Grow your Business!!</h3>
            <p>
              Digitise & automate sales process, get real time business
              visibility with our Integrated SaaS platform
            </p>
            <ContactUsView />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: "21%",
                fontSize: 13,
                color: "#6e6e6e",
              }}
            >
              Version - {packageInfo.version}
            </div>
          </div>{" "}
        </>
      ) : (
        <div style={{ margin: " auto" }}>
          <img
            src={logo_color}
            width="150px"
            style={{ position: "absolute", zIndex: 2, top: 40, left: 50 }}
          />
          <Card
            style={{
              backgroundColor: "#312B81",
              color: "white",
              width: 500,
              margin: "auto",
            }}
          >
            <h3>Select Organization</h3>
            <div
              name="radiogroup"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {state.authVarifyOTP.data.data.data.org_ids.map((data) => {
                let checked = data.id === org.id;
                return (
                  <Checkbox
                    value={data}
                    className={styles.org_list}
                    onChange={handleCheckbox}
                    checked={checked}
                  >
                    <span style={{ marginLeft: 20 }}>{data.legal_name}</span>
                    <span
                      style={{
                        color: "#00EEFF",
                        fontSize: 11,
                        display: "block",
                        marginLeft: 20,
                      }}
                    >
                      ({data.pan_id})
                    </span>
                  </Checkbox>
                );
              })}
              <Button
                size="large"
                className={styles.next_button}
                onClick={handleNext}
              >
                NEXT
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default Login;
