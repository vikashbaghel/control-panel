import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./transferDetails.module.css";
import CustomerDetailCard, {
  getChildLevel,
  getChildLevelName,
} from "../distributor-details/customerDetailCard";
import { BASE_URL_V2, org_id } from "../../../config";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import InfiniteScrollWrapper from "../../infinite-scroll-wrapper/infiniteScrollWrapper";
import { deleteCustomer as deleteCustomerAPI } from "../../../redux/action/customerAction";

export default function CustomerTransferDetails({ isOpen, onChange, details }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { deleteCustomer } = state;

  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [toggleDrawer, setToggleDrawer] = useState(isOpen);

  const [transferConfirm, setTransferConfirm] = useState(false);

  const childName = getChildLevelName(details);

  const handleClose = () => {
    onChange({ toggle: false });
    setTransferConfirm(false);
  };

  const handleCustomerTransferAndDelete = () => {
    dispatch(
      deleteCustomerAPI(details?.id, false, {
        check_children: false,
        customer_parent_id: selectedCustomer?.id,
        is_customer_delete: true,
      })
    );
  };

  const handleCustomerTransfer = () => {
    dispatch(
      deleteCustomerAPI(details?.id, false, {
        check_children: false,
        customer_parent_id: selectedCustomer?.id,
        is_customer_delete: false,
      })
    );
  };

  useEffect(() => {
    if (
      deleteCustomer.data &&
      !deleteCustomer.data.data.error &&
      !state?.deleteCustomer?.data?.params?.check_children
    ) {
      handleClose();
    }
  }, [state]);

  useEffect(() => {
    setToggleDrawer(isOpen);
    if (!isOpen) {
      setSelectedCustomer({});
    }
  }, [isOpen]);

  return (
    <Drawer
      open={toggleDrawer}
      onClose={() =>
        transferConfirm ? handleCustomerTransfer() : handleClose()
      }
      title={
        !transferConfirm ? (
          <div className={styles.drawer_header}>
            <p className={styles.heading}>Transfer {childName}</p>
            <p className={styles.customer_name}>Of {details?.name}</p>
          </div>
        ) : (
          <></>
        )
      }
      width={550}
      headerStyle={{ borderBottom: "none", paddingBlockStart: "2em" }}
    >
      {!transferConfirm ? (
        <div>
          <div className={styles.select_customer}>
            <p>
              Select {details?.customer_level_name} to transfer
              <span style={{ color: "red" }}>*</span>
            </p>
            {selectedCustomer?.id ? (
              <div className={styles.selected_customer}>
                <CustomerDetailCard
                  size="small"
                  data={selectedCustomer}
                  removeButton={true}
                  onRemove={(v) => v && setSelectedCustomer({})}
                />
                <div
                  className={`${styles.btn} button_primary`}
                  onClick={() => setTransferConfirm(true)}
                >
                  Transfer
                </div>
              </div>
            ) : (
              <SingleSelectSearch
                apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?customer_level=${details?.customer_level}`}
                optionFilter={(arr) => {
                  return arr.filter((ele) => ele.id !== details?.id);
                }}
                params={{
                  placeholder: `Select ${details?.customer_level_name}`,
                }}
                onChange={(v) => setSelectedCustomer(v)}
              />
            )}
          </div>
          <div className={styles.mapped_list}>
            <div className={styles.space_between}>
              <p>Mapped {childName} List</p>
              <p>
                {details?.childCount}{" "}
                {details?.childCount > 1 ? childName + "s" : childName}
              </p>
            </div>
            <InfiniteScrollWrapper
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?customer_level=${getChildLevel(
                details
              )}&customer_parent_id=${details?.id}`}
              height={500}
            >
              {(data) => <CustomerDetailCard size="small" data={data} />}
            </InfiniteScrollWrapper>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50%" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: " 350px",
              margin: "0 auto",
            }}
          >
            Delete {details?.name}
          </div>
          <div style={{ color: "#727176", marginTop: 10 }}>
            Are you sure, you want to delete this Customer ?
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            <Button
              className="button_secondary"
              style={{ padding: "0 20px" }}
              onClick={handleCustomerTransfer}
            >
              Keep
            </Button>
            <Button className="button_primary" onClick={handleCustomerTransferAndDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
