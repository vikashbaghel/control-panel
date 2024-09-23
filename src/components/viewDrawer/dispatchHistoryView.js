import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Drawer, Input, Select, Upload } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { auth_token, BASE_URL_V1 } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import { dispatchHistory, lrUpdateOrder } from "../../redux/action/orderAction";
import TextArea from "antd/es/input/TextArea";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import ModalForImagePreview from "../modalForImagePreview/ModalForPreview";

const { Option } = Select;

const DispatchHistoryView = ({ date, order_id, id }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const {
    dispatchHistoryViewOpen,
    setDispatchHistoryViewOpen,
    setPreviewOpen,
    setPreviewImage,
  } = context;
  const [historyData, setHistoryData] = useState("");
  const [lrNumber, setLrNumber] = useState("");
  const [note, setNote] = useState("");
  const [fileList, setFileList] = useState([]);
  const [editOn, setEditOn] = useState(false);

  const [invoice_number, setInvoice_number] = useState("");
  const [transporter_name, setTransporter_name] = useState("");
  const [transporter_mobile_number, setTransporter_mobile_number] =
    useState("");
  const [driver_name, setDriver_name] = useState("");
  const [driver_mobile_number, setDriver_mobile_number] = useState("");
  const [vehicle_number, setVehicle_number] = useState("");
  const [broker_information, setBroker_information] = useState("");
  const [freight_amount, setFreight_amount] = useState(0);
  const [payment_information, setPayment_information] = useState("");

  const cookies = new Cookies();

  useEffect(() => {
    dispatch(dispatchHistory(order_id, id));
  }, [dispatchHistoryViewOpen]);

  const onClose = () => {
    setDispatchHistoryViewOpen(false);
    setLrNumber("");
    setNote("");
    setEditOn(false);
    setInvoice_number("");
    setTransporter_name("");
    setTransporter_mobile_number("");
    setDriver_name("");
    setDriver_mobile_number("");
    setVehicle_number("");
    setBroker_information("");
    setFreight_amount("");
    setPayment_information("");
  };

  const onPreview = async (file) => {
    setPreviewOpen(true);
    setPreviewImage(file.thumbUrl);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  let imageIdList = [];
  const handleSubmit = () => {
    let uploadImageList = fileList.filter((file) => file.thumbUrl);
    if (uploadImageList.length === 0) {
      callingEditApi();
      return;
    }
    uploadImageList.map((item, index) => {
      let type = item.type.split("/")[0];
      let name = item.name;
      let content_type = item.type.split("/")[1];
      let formData = new FormData();
      formData.append("type", type);
      formData.append("file_name", name);
      formData.append("content_type", content_type);

      const url = `${BASE_URL_V1}/s3/upload/`;
      const headers = { Authorization: auth_token };
      const data = formData;

      axios
        .post(url, data, { headers })
        .then((response) => {
          cookies.set("rupyzUploadFileUrl", response.headers.upload_url, {
            path: "/",
          });

          let formData1 = new FormData();
          formData1.append("key", response.headers.key);
          formData1.append("x-amz-algorithm", response.headers.x_amz_algorithm);
          formData1.append("x-amz-signature", response.headers.x_amz_signature);
          formData1.append("x-amz-date", response.headers.x_amz_date);
          formData1.append("Policy", response.headers.policy);
          formData1.append(
            "success_action_status",
            response.data.data[0].success_action_status
          );
          formData1.append(
            "x-amz-credential",
            response.headers.x_amz_credential
          );
          formData1.append("Content-Type", response.data.data[0].content_type);
          formData1.append(
            "Content-Disposition",
            response.data.data[0].content_disposition
          );
          formData1.append("acl", response.data.data[0].acl);
          formData1.append("file", item.originFileObj, item.name);

          const url = cookies.get("rupyzUploadFileUrl");
          const data = formData1;

          axios
            .post(url, data)
            .then((response1) => {
              const url = `${BASE_URL_V1}/s3/confirm/`;
              const data = { file_id: response.data.data[0].id };
              const headers = { Authorization: auth_token };
              axios
                .post(url, data, { headers })
                .then((response2) => {
                  imageIdList.push(response2.data.data.id);
                  callingEditApi();
                })
                .catch((error2) => console.warn(error2));
            })
            .catch((error1) => console.warn(error1));
        })
        .catch((error) => console.warn(error));
    });
  };

  const callingEditApi = () => {
    let uploadImageList = fileList.map((file) => file.id && file.id);
    let testingList = [...uploadImageList, ...imageIdList];
    testingList = testingList.filter((test) => test !== undefined);
    let apiData = {
      lr_no: lrNumber ? lrNumber : historyData.lr_no,
      lr_images: testingList,
      invoice_images: [],
      notes: note ? note : historyData.notes,
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
    dispatch(lrUpdateOrder(apiData, historyData.order, historyData.id));
    setEditOn(false);
    onClose();
  };

  useEffect(() => {
    if (state.dispatchHistory.data !== "") {
      if (state.dispatchHistory.data.data.error === false) {
        setHistoryData(state.dispatchHistory.data.data.data);
        setFileList(state.dispatchHistory.data.data.data.lr_images_url);
        setNote(state.dispatchHistory.data.data.data.notes);
        setLrNumber(state.dispatchHistory.data.data.data.lr_no);
        setInvoice_number(state.dispatchHistory.data.data.data.invoice_number);
        setTransporter_name(
          state.dispatchHistory.data.data.data.transporter_name
        );
        setTransporter_mobile_number(
          state.dispatchHistory.data.data.data.transporter_mobile_number
        );
        setDriver_name(state.dispatchHistory.data.data.data.driver_name);
        setDriver_mobile_number(
          state.dispatchHistory.data.data.data.driver_mobile_number
        );
        setVehicle_number(state.dispatchHistory.data.data.data.vehicle_number);
        setBroker_information(
          state.dispatchHistory.data.data.data.broker_information
        );
        setFreight_amount(state.dispatchHistory.data.data.data.freight_amount);
        setPayment_information(
          state.dispatchHistory.data.data.data.payment_information
        );
      }
    }
  }, [state]);

  return (
    <>
      {historyData && (
        <Drawer
          className="container"
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <CloseOutlined onClick={() => onClose()} />
                &nbsp;&nbsp;&nbsp;
                {date}
              </div>
              <div>
                <a href={historyData.dispatch_order_file_url} target="_blank">
                  <Button>Download Pdf</Button>
                </a>
              </div>
            </div>
          }
          width={650}
          closable={false}
          onClose={onClose}
          open={dispatchHistoryViewOpen}
          style={{ overflowY: "auto" }}
        >
          <>
            <h3>Total Amount: {toIndianCurrency(historyData.total_amount)}</h3>
            <Card>
              <div style={{ position: "relative" }}>
                {!editOn ? (
                  <Button
                    type="primary"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: -10,
                      zIndex: 2,
                    }}
                    onClick={() => setEditOn(!editOn)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    style={{
                      position: "absolute",
                      right: 0,
                      top: -10,
                      zIndex: 2,
                    }}
                    type="dashed"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>LR/BILTY Number</label>
                  <Input
                    size="large"
                    value={lrNumber}
                    onChange={(e) => setLrNumber(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Order/Invoice Number</label>
                  <Input
                    size="large"
                    value={invoice_number}
                    onChange={(e) => setInvoice_number(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Transporter Name</label>
                  <Input
                    size="large"
                    value={transporter_name}
                    onChange={(e) => setTransporter_name(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>
                    Transporter Contact number{" "}
                  </label>
                  <Input
                    size="large"
                    value={transporter_mobile_number}
                    onChange={(e) =>
                      setTransporter_mobile_number(e.target.value)
                    }
                    disabled={!editOn}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    type="mobile"
                    maxLength={10}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Driver Name</label>
                  <Input
                    size="large"
                    value={driver_name}
                    onChange={(e) => setDriver_name(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Driver Mobile number</label>
                  <Input
                    size="large"
                    value={driver_mobile_number}
                    onChange={(e) => setDriver_mobile_number(e.target.value)}
                    disabled={!editOn}
                    type="mobile"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Vehicle Number</label>
                  <Input
                    size="large"
                    value={vehicle_number}
                    onChange={(e) => setVehicle_number(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>
                    Broker Details (If any)
                  </label>
                  <Input
                    size="large"
                    value={broker_information}
                    onChange={(e) => setBroker_information(e.target.value)}
                    disabled={!editOn}
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Freight </label>
                  <Input
                    size="large"
                    value={freight_amount}
                    onChange={(e) => setFreight_amount(e.target.value)}
                    disabled={!editOn}
                    type="number"
                  />
                </div>
                <div style={{ width: "49%", marginTop: 20 }}>
                  <label style={{ fontSize: 13 }}>Payment</label>
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    value={payment_information}
                    onChange={(e) => setPayment_information(e)}
                    disabled={!editOn}
                  >
                    <Option value="Paid">Paid</Option>
                    <Option value="To Be Paid">To Be Paid</Option>
                  </Select>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 13 }}>Photo :</label>
                <div>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    multiple
                    accept={"image/jpeg, image/png, image/jpg"}
                  >
                    {editOn && "+ Upload"}
                  </Upload>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 13 }}>Note</label>
                <br />
                <TextArea
                  size="large"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={!editOn}
                />
              </div>
            </Card>
            <br />
          </>
          {historyData &&
            historyData.items.map((item, index) => (
              <div>
                <Card key={index}>
                  <h6
                    style={{
                      position: "absolute",
                      top: -17,
                      left: 10,
                      color: "rgb(157 157 157)",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      width: 200,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.code}
                  </h6>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: 330,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {item.name}
                    </div>
                    <b>{toIndianCurrency(item.total_price)}</b>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div>{item.category}</div>
                      <div>
                        Buyer Price <b>{toIndianCurrency(item.price)}</b>
                      </div>
                      <div>Qty : {item.qty}</div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          textAlign: "center",
                          marginRight: 20,
                          marginTop: 12,
                        }}
                      >
                        <div>Order</div>
                        <Input
                          value={item.qty}
                          disabled
                          style={{
                            width: 50,
                            textAlign: "center",
                            color: "rgb(58 58 58)",
                          }}
                        />
                      </div>
                      <div style={{ textAlign: "center", marginTop: 12 }}>
                        <div>Shipment</div>
                        <Input
                          value={item.dispatch_qty}
                          disabled
                          style={{
                            width: 50,
                            textAlign: "center",
                            color: "rgb(58 58 58)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
                <br />
              </div>
            ))}
          <ModalForImagePreview />
        </Drawer>
      )}
    </>
  );
};

export default DispatchHistoryView;
