// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Shipped-Order-Form

import React, { useContext, useEffect, useState } from "react";
import { Checkbox, Radio, Space, Upload, notification } from "antd";
import styles from "../viewDrawer/order.module.css";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import { orderViewAction } from "../../redux/action/orderViewAction";
import { dispatchOrder } from "../../redux/action/orderAction";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import ModalForImagePreview from "../modalForImagePreview/ModalForPreview";
import FormStepper from "../formStepper/formStepper";
import { NoPhoto } from "../../assets";
import { capitalizeFirst } from "../../views/distributor";
import { handleScroll } from "../../helpers/regex";
import { getGeoLocationAndAddress } from "../../services/location-service";
import ImageUploader, { uploadImage } from "../image-uploader/ImageUploader";

const ShippedOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const {
    shippedOrderViewOpen,
    isShipmentQtyChange,
    setIsShipmentQtyChange,
    shippedOrderData,
    setLoading,
  } = context;

  const [incomingData, setIncomingData] = useState(
    shippedOrderData ? shippedOrderData.items : ""
  );
  const [stepPageNo, setStepPageNo] = useState(1);
  const [recepitNumber, setRecepitNumber] = useState("");
  const [fileList, setFileList] = useState([]);
  const [note, setNote] = useState("");
  const [carryRemainingOrder, setCarryRemainingOrder] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [unCheckedList, setUnCheckedList] = useState([]);
  const [confirmList, setConfirmList] = useState([]);

  const [invoice_number, setInvoice_number] = useState("");
  const [transporter_name, setTransporter_name] = useState("");
  const [transporter_mobile_number, setTransporter_mobile_number] =
    useState("");
  const [driver_name, setDriver_name] = useState("");
  const [driver_mobile_number, setDriver_mobile_number] = useState("");
  const [vehicle_number, setVehicle_number] = useState("");
  const [broker_information, setBroker_information] = useState("");
  const [freight_amount, setFreight_amount] = useState(0);
  const [payment_information, setPayment_information] = useState("Paid");

  const [disableConfirm, setDisableConfirm] = useState(false);

  const cookies = new Cookies();

  const onChangeCheckbox = (e) => {
    if (e.target.checked === false) {
      setUnCheckedList([...unCheckedList, e.target.value]);
      setIsChecked(true);
      return;
    }
    let newList = unCheckedList.filter((ele) => ele !== e.target.value);
    setUnCheckedList(newList);
    setIsChecked(true);
  };

  const handleCheckedAll = (e) => {
    if (e.target.checked === true) {
      setUnCheckedList([]);
      return;
    }
    setUnCheckedList(
      shippedOrderData.items.map((shippedOrderData) => shippedOrderData.id)
    );
  };

  useEffect(() => {
    let dataWithDispatchCount = localStorage.getItem("rupyzDispatchItems");
    dataWithDispatchCount =
      dataWithDispatchCount && JSON.parse(dataWithDispatchCount);
    dataWithDispatchCount =
      dataWithDispatchCount &&
      dataWithDispatchCount
        .filter((e) => !unCheckedList.includes(e.id))
        .map((filteredListItem) => filteredListItem);
    setConfirmList(dataWithDispatchCount);
    setIsChecked(false);
  }, [isChecked]);

  const handleConfirm = async () => {
    setLoading(true);
    const uploadResult = await uploadImage(fileList);
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress()
            .then((response) => {
              setDisableConfirm(true);
              submitDispatchAPI({
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                geo_address: response.address,
                location_permission: true,
                lr_images: uploadResult || [],
              });
            })
            .catch((error) => console.log(error));
          navigator.geolocation.getCurrentPosition(function (position) {});
          return;
        }
        setLoading(false);
        openNotification({
          location_permission: false,
          lr_images: uploadResult || [],
        });
        // Don't do anything if the permission was denied.
      });
      return;
    }
    setDisableConfirm(true);
    submitDispatchAPI({
      location_permission: false,
      lr_images: uploadResult || [],
    });
  };

  const openNotification = (response) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            notification.destroy();
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            notification.destroy(key);
            setDisableConfirm(true);
            submitDispatchAPI(response);
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    notification.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
    });
  };

  const submitDispatchAPI = async (response = {}) => {
    let revomingZeroDispatchQty = confirmList.filter(
      (data) => data.dispatch_qty && data.dispatch_qty > 0
    );
    if (revomingZeroDispatchQty.length <= 0)
      return notification.warning({
        message: "Dispatch Items Cannot Be Zero!",
      });
    let apiData = {
      items: revomingZeroDispatchQty,
      lr_no: recepitNumber,
      notes: note,
      is_closed: !carryRemainingOrder,
      invoice_number: invoice_number,
      transporter_name: transporter_name,
      transporter_mobile_number: transporter_mobile_number,
      driver_name: driver_name,
      driver_mobile_number: driver_mobile_number,
      vehicle_number: vehicle_number,
      broker_information: broker_information,
      freight_amount: roundToDecimalPlaces(freight_amount),
      payment_information: payment_information,
    };
    dispatch(dispatchOrder(shippedOrderData.id, { ...apiData, ...response }));
    setTimeout(() => {
      navigate("/web/order/order-list");
      setDisableConfirm(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    let dataWithDispatchCount = localStorage.getItem("rupyzDispatchItems");
    dataWithDispatchCount =
      dataWithDispatchCount && JSON.parse(dataWithDispatchCount);
    setIncomingData(dataWithDispatchCount);
    setIsShipmentQtyChange(false);

    // for Listing checkedItem
    if (stepPageNo === 1) {
      setUnCheckedList(unCheckedList);
    }

    dataWithDispatchCount =
      dataWithDispatchCount &&
      dataWithDispatchCount
        .filter((e) => !unCheckedList.includes(e.id))
        .map((filteredListItem) => filteredListItem);
    setConfirmList(dataWithDispatchCount);
  }, [isShipmentQtyChange, shippedOrderViewOpen]);

  const isOrderEmpty = () => {
    let tempList = incomingData.filter((e) => !unCheckedList.includes(e.id));
    if (incomingData && incomingData.length === unCheckedList.length) {
      notification.warning({
        message: "Please add a product before proceeding",
      });
      return true;
    }
    if (
      tempList.reduce((total, item) => {
        return total + item.dispatch_qty;
      }, 0) === 0
    ) {
      notification.warning({
        message: "Please add a quantity before proceeding",
      });
      return true;
    }
    return false;
  };

  return (
    <>
      <div
        style={{
          width: "52%",
          fontFamily: "Poppins",
          margin: "auto",
          marginTop: 20,
        }}
      >
        <div style={{ scale: "0.8" }}>
          <FormStepper totalCount={3} activeCount={stepPageNo} />
        </div>
        <br />
        {stepPageNo === 1 ? (
          <div>
            <Checkbox
              defaultChecked={true}
              onChange={handleCheckedAll}
              checked={unCheckedList.length === 0 ? true : false}
              style={{ fontSize: 18 }}
            >
              Select All Products
            </Checkbox>
            <br />
            <br />
            <div className={styles.item_container}>
              <div className={styles.table_header}>
                <div>Product Details</div>
                <div>
                  <span>Order</span>
                  <span>Shipment</span>
                </div>
              </div>
              {incomingData &&
                incomingData.map((item, index) => {
                  return item.qty > item.total_dispatched_qty ? (
                    <div key={index} className={styles.item_card}>
                      <div>
                        <Checkbox
                          onChange={onChangeCheckbox}
                          checked={!unCheckedList.includes(item.id)}
                          value={item.id}
                        />
                        <img
                          src={
                            item.display_pic_url
                              ? item.display_pic_url
                              : NoPhoto
                          }
                          alt="product"
                          width={100}
                          height={100}
                          style={{ marginLeft: 20 }}
                        />
                        <div style={{ marginLeft: 20 }}>
                          <div style={{ fontSize: 17, fontWeight: 600 }}>
                            {item.name}
                          </div>
                          <div style={{ margin: "5px 0" }}>
                            <span style={{ color: "#727176" }}>
                              Category :{" "}
                            </span>
                            {item.category}
                          </div>
                          <div>
                            <span style={{ color: "#727176" }}>Unit : </span>
                            {item.packaging_unit}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "0 24px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              textAlign: "center",
                              marginRight: 50,
                            }}
                          >
                            {item.qty}
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <ShipmentInput
                              data={item}
                              disabled={unCheckedList.includes(item.id)}
                              shippedOrderViewOpen={shippedOrderViewOpen}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  );
                })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  margin: "15px 20px ",
                }}
              >
                <div>
                  <div style={{ marginBottom: 10 }}>
                    Do you want to carry remaining order
                    <span style={{ color: "red" }}> *</span>
                  </div>
                  <Radio.Group
                    value={carryRemainingOrder}
                    onChange={(e) => setCarryRemainingOrder(e.target.value)}
                  >
                    <Radio.Button value={true}>Yes</Radio.Button>
                    <Radio.Button value={false}>No</Radio.Button>
                  </Radio.Group>
                </div>
                <button
                  className="button_primary"
                  onClick={() => {
                    isOrderEmpty() || setStepPageNo(stepPageNo + 1);
                  }}
                  style={{ borderRadius: 4 }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        ) : stepPageNo === 2 ? (
          <div>
            <div className={styles.item_container} style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>LR/BILTY Number</div>
                  <input
                    placeholder="Enter LR Number"
                    value={recepitNumber}
                    onChange={(e) => setRecepitNumber(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Order/Invoice Number</div>
                  <input
                    placeholder="Enter Order/Invoice Number"
                    value={invoice_number}
                    onChange={(e) => setInvoice_number(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Transporter Name</div>
                  <input
                    placeholder="Enter Transporter Name"
                    value={transporter_name}
                    onChange={(e) => setTransporter_name(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>
                    Transporter Contact number{" "}
                  </div>
                  <input
                    placeholder="Enter Transporter Contact number"
                    value={transporter_mobile_number}
                    onChange={(e) =>
                      setTransporter_mobile_number(e.target.value)
                    }
                    type="mobile"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Driver Name</div>
                  <input
                    placeholder="Enter Driver Name"
                    value={driver_name}
                    onChange={(e) => setDriver_name(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Driver Mobile number</div>
                  <input
                    placeholder="Enter Mobile number"
                    value={driver_mobile_number}
                    onChange={(e) => setDriver_mobile_number(e.target.value)}
                    type="mobile"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Vehicle Number</div>
                  <input
                    placeholder="Enter Vehicle Number"
                    value={vehicle_number}
                    onChange={(e) => setVehicle_number(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Broker Details (If any)</div>
                  <input
                    placeholder="Enter Broker Details"
                    value={broker_information}
                    onChange={(e) => setBroker_information(e.target.value)}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Freight </div>
                  <input
                    placeholder="Enter Freight"
                    value={freight_amount}
                    onChange={(e) => setFreight_amount(e.target.value)}
                    type="number"
                    onWheel={handleScroll}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  <div className={styles.label}>Payment</div>
                  <select
                    style={{ width: "100%" }}
                    placeholder="Enter Payment"
                    value={payment_information}
                    onChange={(e) => setPayment_information(e.target.value)}
                  >
                    <option value="Paid">Paid</option>
                    <option value="To Be Paid">To Be Paid</option>
                  </select>
                </div>
              </div>
              <div className={styles.label}>Attachments</div>
              <ImageUploader
                maxCount={6}
                accept=".jpeg,.png,.jpg,.pdf"
                onChange={(v) => {
                  setFileList(v);
                }}
                value={fileList}
              />
              <div className={styles.label}>Notes</div>
              <textarea
                placeholder="Note"
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "end",
              }}
            >
              <button
                className={"button_secondary"}
                style={{
                  width: 100,
                  marginRight: 20,
                }}
                onClick={() => setStepPageNo(stepPageNo - 1)}
              >
                BACK
              </button>
              <button
                style={{ width: 100, borderRadius: 5 }}
                className="button_primary"
                onClick={() => {
                  if (
                    (transporter_mobile_number.length === 10 ||
                      transporter_mobile_number.length === 0) &&
                    (driver_mobile_number.length === 10 ||
                      driver_mobile_number.length === 0)
                  ) {
                    setStepPageNo(stepPageNo + 1);
                    // handleUploadImage();
                    return;
                  }
                  notification.warning({
                    message: "Please Enter a Valid Mobile Number",
                  });
                }}
              >
                REVIEW
              </button>
            </div>
          </div>
        ) : (
          stepPageNo === 3 && (
            <>
              <div className={styles.item_container}>
                <div style={{ padding: "20px" }}>
                  <b>Review Shipment</b>
                  <div className="review_img">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>LR/BILTY Number :</div>
                        <div style={{ padding: 10 }}>
                          {recepitNumber ? (
                            recepitNumber
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>
                          Order/Invoice Number :
                        </div>
                        <div style={{ padding: 10 }}>
                          {invoice_number ? (
                            invoice_number
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>Transporter Name :</div>
                        <div style={{ padding: 10 }}>
                          {transporter_name ? (
                            transporter_name
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>
                          Transporter Contact number :
                        </div>
                        <div style={{ padding: 10 }}>
                          {transporter_mobile_number ? (
                            transporter_mobile_number
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>LR/ BILTY Number :</div>
                        <div style={{ padding: 10 }}>
                          {driver_name ? (
                            driver_name
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>
                          Driver Mobile number :
                        </div>
                        <div style={{ padding: 10 }}>
                          {driver_mobile_number ? (
                            driver_mobile_number
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>Vehicle Number :</div>
                        <div style={{ padding: 10 }}>
                          {vehicle_number ? (
                            vehicle_number
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>
                          Broker Details (If any) :
                        </div>
                        <div style={{ padding: 10 }}>
                          {broker_information ? (
                            broker_information
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>Freight :</div>
                        <div style={{ padding: 10 }}>
                          {freight_amount ? (
                            freight_amount
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: "49%" }}>
                        <div className={styles.label}>Payment :</div>
                        <div style={{ padding: 10 }}>
                          {payment_information ? (
                            payment_information
                          ) : (
                            <div style={{ color: "#727176" }}>N/A</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {fileList.length > 0 ? (
                      <>
                        <div className={styles.label}>Attachments :</div>
                        <ImageUploader
                          maxCount={0}
                          accept=".jpeg,.png,.jpg,.pdf"
                          value={fileList}
                          disabledEdit={true}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    {note ? (
                      <div>
                        <div className={styles.label}>Note :</div>
                        <textarea disabled rows={4} value={note} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div className={styles.item_container}>
                <div className={styles.table_header}>
                  <div>Product Details</div>
                  <div>
                    <span>Order</span>
                    <span>Shipment</span>
                  </div>
                </div>
                {confirmList &&
                  confirmList.map((item, index) =>
                    item.dispatch_qty && item.dispatch_qty > 0 ? (
                      <div
                        key={index}
                        className={styles.item_card}
                        style={{ padding: " 20px" }}
                      >
                        <div>
                          <img
                            src={
                              item.display_pic_url
                                ? item.display_pic_url
                                : NoPhoto
                            }
                            alt="product"
                            width={100}
                            height={100}
                            style={{ marginLeft: 20 }}
                          />
                          <div style={{ marginLeft: 20 }}>
                            <div style={{ fontSize: 17, fontWeight: 600 }}>
                              {item.name}
                            </div>
                            <div style={{ margin: "5px 0" }}>
                              <span style={{ color: "#727176" }}>
                                Category :{" "}
                              </span>
                              {item.category}
                            </div>
                            <div>
                              <span style={{ color: "#727176" }}>Unit : </span>
                              {item.packaging_unit}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div style={{ textAlign: "center", width: 100 }}>
                              {roundToDecimalPlaces(item.qty)}
                            </div>
                            <div style={{ textAlign: "center", width: 100 }}>
                              {roundToDecimalPlaces(item.dispatch_qty)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                <div>
                  <OrderItemDetails data={confirmList} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <div>
                  {carryRemainingOrder ? (
                    <p> You are carrying the remaining order</p>
                  ) : (
                    <p> You are not carrying the remaining order</p>
                  )}
                </div>
                <div style={{ display: "flex", height: 40 }}>
                  <button
                    style={{ width: 100, marginRight: 20 }}
                    onClick={() => setStepPageNo(stepPageNo - 1)}
                    className="button_secondary"
                  >
                    BACK
                  </button>
                  <button
                    style={{ width: 100 }}
                    className="button_primary"
                    onClick={handleConfirm}
                    disabled={disableConfirm}
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>
      <ModalForImagePreview />
    </>
  );
};

export default ShippedOrder;

export const ShipmentInput = ({ data, disabled }) => {
  const context = useContext(Context);
  const { setIsShipmentQtyChange } = context;
  const [shipmentQty, setShipmentQty] = useState(null);

  useEffect(() => {
    let dispatchItems = localStorage.getItem("rupyzDispatchItems");
    dispatchItems = dispatchItems && JSON.parse(dispatchItems);
    dispatchItems =
      dispatchItems &&
      dispatchItems
        .filter((ele) => ele.qty > ele.total_dispatched_qty)
        .map((filteredListItem) => filteredListItem);

    let filterItems =
      dispatchItems && dispatchItems.map((item) => item.id === data.id);
    for (let i = 0; i < filterItems.length; i++) {
      if (filterItems[i]) {
        Object.assign(dispatchItems[i], {
          dispatch_qty: parseFloat(
            shipmentQty !== null
              ? shipmentQty
              : data.dispatch_qty
              ? data.dispatch_qty
              : data.qty - data.total_dispatched_qty
          ),
        });
        localStorage.setItem(
          "rupyzDispatchItems",
          JSON.stringify(dispatchItems)
        );
      }
    }
    setIsShipmentQtyChange(true);
  }, [shipmentQty]);

  return (
    <div style={{ width: 100, marginLeft: 5 }}>
      <input
        type="number"
        placeholder="Quantity"
        style={{ textAlign: "center", color: "rgb(58 58 58)" }}
        value={
          shipmentQty !== null
            ? shipmentQty
            : data.dispatch_qty
            ? data.dispatch_qty
            : data.qty - data.total_dispatched_qty
        }
        onChange={(e) => {
          if (e.target.value < 0) {
            notification.warning({
              message: "Shipment Quantity Cannot Be Less Then Zero",
            });
            return;
          } else if (
            (e.target.value?.length === 0 && !e.target.value) ||
            /^\d+(\.\d{0,2})?$/.test(e.target.value)
          ) {
            setShipmentQty(e.target.value);
          }
        }}
        disabled={disabled}
        onWheel={handleScroll}
      />
    </div>
  );
};

const OrderItemDetails = ({ data }) => {
  function aggregatePackagingQuantities(products) {
    const packagingQtyMap = products.reduce(
      (acc, { packaging_unit, dispatch_qty }) => {
        const unit = packaging_unit?.toLowerCase();
        if (acc.has(unit)) {
          acc.set(unit, acc.get(unit) + dispatch_qty);
        } else {
          acc.set(unit, dispatch_qty);
        }
        return acc;
      },
      new Map()
    );

    return Array.from(packagingQtyMap, ([packaging_unit, dispatch_qty]) => ({
      packaging_unit,
      qty: dispatch_qty,
    }));
  }

  const aggregatedArray = data && aggregatePackagingQuantities(data);

  return (
    <div className={styles.dispatch_item_list_group}>
      <div style={{ color: "#727176", margin: "0 20px", marginBottom: 10 }}>
        Order Quantity :
      </div>
      <div className={styles.dispatch_group_2_line_inner_heading}>
        <div>Unit</div>
        <div>Quantity</div>
      </div>
      {aggregatedArray?.map((item, index) => {
        return (
          <div key={index} className={styles.dispatch_group_2_line_inner}>
            <div>{capitalizeFirst(item.packaging_unit)}</div>
            <div>{item.qty}</div>
          </div>
        );
      })}
    </div>
  );
};
