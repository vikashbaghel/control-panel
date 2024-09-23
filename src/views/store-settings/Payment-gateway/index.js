import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  addPaymentGateway,
  getPaymentGatewayList,
} from "../../../redux/action/razorpayServices";
import { Modal, Spin, notification } from "antd";
import rupyzLogo from "../../../assets/logo-colored.png";
import LinkedAccountDetails from "./linkedAccountDetails";
import LineLoader from "../../../components/loader/LineLoader";
import { razorpayLogo } from "../../../assets/navbarImages/storefront";

export default function RazorpayAuthorization() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");
  const state = queryParams.get("state");

  const [accountsList, setAccountsList] = useState([]);
  const [connectionLoading, setConnectionLoading] = useState(
    code && state ? true : false
  );
  const [isLoading, setIsLoading] = useState(!connectionLoading);

  const fetchData = async () => {
    const res = await getPaymentGatewayList();
    if (res && res.status === 200) {
      setAccountsList(res.data.data);
      setIsLoading(false);
    }
  };

  const fetchConnection = async () => {
    if (code && state) {
      const data = {
        pg_name: "Razorpay",
        code,
        state,
        status: "Processing",
      };
      const res = await addPaymentGateway(data);
      if (res && res.status === 200 && !res.data.error) {
        navigate("/web/storefront?tab=payment-gateway");
        fetchData();
        notification.success({ message: res?.data?.message });
      }
      setConnectionLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchConnection();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {isLoading ? (
        <div className={styles.flex}>
          <Spin />
          Fetching Content
        </div>
      ) : (
        <>
          {accountsList?.length === 0 ? (
            <div className={styles.container}>
              <div>
                <img src={razorpayLogo} alt="razorpay" />
              </div>
              <p className={styles.text}>
                Link your Razorpay account to accept <br /> payments on your
                storefront
              </p>
              <div>
                <button className="button_primary" onClick={linkAccount}>
                  Link Razorpay Account
                </button>
              </div>
            </div>
          ) : (
            <LinkedAccountDetails
              {...{ accountsList }}
              refetchList={fetchData}
            />
          )}
          <ConnectionSetupLoader {...{ connectionLoading }} />
        </>
      )}
    </div>
  );
}

export function ConnectionSetupLoader({ connectionLoading }) {
  return (
    <Modal
      centered
      open={connectionLoading}
      closable={false}
      title={
        <div style={{ paddingBlock: "1em", fontSize: 18, textAlign: "center" }}>
          Setting Up
        </div>
      }
      footer={null}
    >
      <div className={styles.flex} style={{ padding: "3em 1em" }}>
        <img src={rupyzLogo} alt="Rupyz" width={128} height={36} />
        <LineLoader />
        <img src={razorpayLogo} alt="razorpay" />
      </div>
    </Modal>
  );
}

export const linkAccount = async () => {
  const res = await addPaymentGateway({
    pg_name: "Razorpay",
    status: "Initiated",
  });

  if (res) {
    if (res.status === 200) {
      const { url, state, client_id, redirect_uri, scope, response_type } =
        res.data.data;
      const params = {
        state,
        client_id,
        redirect_uri,
        scope,
        response_type,
      };

      let searchParams = createSearchParams(params).toString();
      window.location.assign([url, searchParams].join("?"));
    } else {
      notification.warning({ message: res.response.data.message });
    }
  }
};
