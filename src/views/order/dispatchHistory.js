import React, { useContext, useEffect, useState } from "react";
import { Col, Drawer, Modal, Upload } from "antd";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { auth_token, BASE_URL_V1 } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import {
  dispatchHistory,
  lrUpdateOrder as lrUpdateOrderAPI,
} from "../../redux/action/orderAction";
import styles from "./oderDetails.module.css";
import moment from "moment";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { numberValidation } from "../../helpers/regex";
import { ArrowRightOutlined } from "@ant-design/icons";
import WrapText from "../../components/wrapText";
import {
  ArrowLeft,
  CrossIcon,
  Download,
  EditIcon,
  UploadFile,
} from "../../assets/globle";
import { imgFormatCheck } from "../../helpers/globalFunction";
import pdfIcon from "../../assets/defaultPdf.svg";
import ImageUploader from "../../components/image-uploader/ImageUploader";
import { ImageViewer } from "../../components/image-uploader/ImageUploader";
import { uploadImage } from "../../components/image-uploader/ImageUploader";

const DispatchHistoryView = ({ openLRUpdate, setOpenLRUpdate, detail }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { lrUpdateOrder } = state;
  const context = useContext(Context);
  //   to manage the form data for LR update
  const [formInput, setFormInput] = useState(initialInput);

  //   state to manage the upload image list
  const [uploadImageList, setUploadImageList] = useState([]);
  const cookies = new Cookies();

  // setting the data for the LR history comming through order Detail page
  useEffect(() => {
    setFormInput((prevState) => ({
      ...prevState,
      lr_no: detail.lr_no,
      invoice_images: detail.invoice_images_url,
      notes: detail.notes,
      invoice_number: detail.invoice_number,
      transporter_name: detail.transporter_name,
      transporter_mobile_number: detail.transporter_mobile_number,
      driver_name: detail.driver_name,
      driver_mobile_number: detail.driver_mobile_number,
      vehicle_number: detail.vehicle_number,
      broker_information: detail.broker_information,
      freight_amount: detail.freight_amount,
      payment_information: detail.payment_information,
    }));
    setUploadImageList(detail.lr_images_url);
  }, [detail]);

  const onChange = ({ fileList: newFileList }) => {
    setUploadImageList(newFileList);
    console.log("filessss:", newFileList);
  };

  const handleSubmit = async () => {
    let prevImages = uploadImageList
      ?.filter((ele) => ele.id)
      .map((ele) => ele.id);
    let newImages = uploadImageList?.filter((ele) => !ele.id);
    let result = [];
    if (uploadImageList?.length > 0) {
      result = await uploadImage(newImages)
        .then((res) => res)
        .catch((error) => {});
    }
    callingEditApi([...(prevImages || []), ...result]);
  };

  const callingEditApi = (imageIdList) => {
    let apiData = formInput;
    Object.assign(apiData, {
      lr_images: imageIdList,
    });
    dispatch(lrUpdateOrderAPI(apiData, detail.order, detail.id));
  };

  // When form is submitted successfully
  useEffect(() => {
    if (lrUpdateOrder.data && lrUpdateOrder.data.data.error === false) {
      setOpenLRUpdate(false);
      dispatch(dispatchHistory(detail.order, detail.id));
    }
  }, [state]);

  const handleFormChange = (e) => {
    if (e.target.name === "freight_amount") {
      return setFormInput((prevState) => {
        return {
          ...prevState,
          [e.target.name]: roundToDecimalPlaces(e.target.value),
        };
      });
    }
    setFormInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  return (
    <Modal
      open={openLRUpdate}
      onOk={() => setOpenLRUpdate(false)}
      title={
        <div className={styles.modal_title}>
          {moment(detail.created_at).format("DD MMM YYYY (hh:mm a)")}
        </div>
      }
      width={670}
      centered
      onCancel={() => setOpenLRUpdate(false)}
      footer={[
        <div className={styles.modal_bottom}>
          <button className="button_primary" onClick={() => handleSubmit()}>
            Submit
          </button>
          <button
            className="button_secondary"
            onClick={() => setOpenLRUpdate(false)}
          >
            Cancel
          </button>
        </div>,
      ]}
    >
      <div className={styles.modal_body}>
        <div className={styles.modal_input_group}>
          <div>
            <label>LR/BILTY Number</label>
            <input
              value={formInput.lr_no}
              onChange={handleFormChange}
              name="lr_no"
            />
          </div>
          <div>
            <label>Order/Invoice Number</label>
            <input
              value={formInput.invoice_number}
              onChange={handleFormChange}
              name="invoice_number"
            />
          </div>
        </div>
        <div className={styles.modal_input_group}>
          <div>
            <label>Transporter Name</label>
            <input
              value={formInput.transporter_name}
              onChange={handleFormChange}
              name="transporter_name"
            />
          </div>
          <div>
            <label>Transporter Contact Number</label>
            <input
              value={formInput.transporter_mobile_number}
              onChange={handleFormChange}
              name="transporter_mobile_number"
              onKeyPress={numberValidation}
              maxLength={10}
            />
          </div>
        </div>
        <div className={styles.modal_input_group}>
          <div>
            <label>Driver Name</label>
            <input
              value={formInput.driver_name}
              onChange={handleFormChange}
              name="driver_name"
            />
          </div>
          <div>
            <label>Driver Mobile Number</label>
            <input
              value={formInput.driver_mobile_number}
              onChange={handleFormChange}
              name="driver_mobile_number"
              onKeyPress={numberValidation}
              maxLength={10}
            />
          </div>
        </div>
        <div className={styles.modal_input_group}>
          <div>
            <label>Vehicle Number</label>
            <input
              value={formInput.vehicle_number}
              onChange={handleFormChange}
              name="vehicle_number"
            />
          </div>
          <div>
            <label>Broker Details (If any)</label>
            <input
              value={formInput.broker_information}
              onChange={handleFormChange}
              name="broker_information"
            />
          </div>
        </div>
        <div className={styles.modal_input_group}>
          <div>
            <label>Freight</label>
            <input
              value={formInput.freight_amount}
              onChange={handleFormChange}
              name="freight_amount"
              onKeyPress={numberValidation}
              maxLength={6}
            />
          </div>
          <div>
            <label>Payment</label>
            <select
              value={formInput.payment_information}
              onChange={handleFormChange}
              name="payment_information"
            >
              <option value="Paid">Paid</option>
              <option value="To Be Paid">To Be Paid</option>
            </select>
          </div>
        </div>
        <div>
          <label>Attachments</label>
          <br />
          <Col>
            <ImageUploader
              maxCount={6}
              accept=".jpeg,.png,.jpg,.pdf"
              onChange={(v) => {
                setUploadImageList(v);
              }}
              value={uploadImageList}
            />
          </Col>
        </div>
        <br />
        <div>
          <label>Notes</label>
          <br />
          <textarea
            value={formInput.notes}
            name="notes"
            onChange={handleFormChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DispatchHistoryView;

let initialInput = {
  lr_no: "",
  lr_images: [],
  notes: "",
  invoice_number: "",
  transporter_name: "",
  transporter_mobile_number: "",
  driver_name: "",
  driver_mobile_number: "",
  vehicle_number: "",
  broker_information: "",
  freight_amount: 0,
  payment_information: "",
};

export const DispatchOrder = ({
  orderDetail,
  dispatchDetails,
  setDispatchDetails,
  callingDispatchDetail,
}) => {
  return (
    <div>
      <div className={styles.dispatch_head}>Dispatch Details</div>
      <div className={styles.dispatch_list_item}>
        {orderDetail.dispatch_history_list?.map((data, index) => (
          <div
            key={index}
            onClick={() =>
              callingDispatchDetail({
                order_id: orderDetail.id,
                id: data.id,
              })
            }
          >
            <span>
              {moment(data.created_at).format("DD MMM, YYYY - hh:mm A ")}
            </span>
            <ArrowRightOutlined />
          </div>
        ))}
      </div>
      <DispatchDetails {...{ dispatchDetails, setDispatchDetails }} />
    </div>
  );
};

export const DispatchDetails = ({ dispatchDetails, setDispatchDetails }) => {
  //   to control the modale for LR edit
  const [openLRUpdate, setOpenLRUpdate] = useState(false);
  const [previewImage, setPreviewImage] = useState({
    open: false,
    url: "",
  });

  const detailList = [
    { label: "LR/BILTY No.", value: dispatchDetails.lr_no },
    { label: "Order/Invoice No.", value: dispatchDetails.invoice_number },
    { label: "Transporter Name", value: dispatchDetails.transporter_name },
    {
      label: "Transporter Contact No.",
      value: dispatchDetails.transporter_mobile_number,
    },
    { label: "Driver Name", value: dispatchDetails.driver_name },
    {
      label: "Driver Mobile No.",
      value: dispatchDetails.driver_mobile_number,
    },
    { label: "Vehicle No.", value: dispatchDetails.vehicle_number },
    { label: "Broker Details", value: dispatchDetails.broker_information },
    {
      label: "Freight",
      value: toIndianCurrency(dispatchDetails.freight_amount),
    },
    { label: "Payment", value: dispatchDetails.payment_information },
  ];

  const onClose = () => setDispatchDetails({});
  return (
    <>
      <Drawer
        open={Object.keys(dispatchDetails).length > 0}
        title={
          <div
            className={styles.dispatch_drawer_header}
            style={{ justifyContent: "center" }}
          >
            {moment(dispatchDetails.created_at).format(
              "DD MMM, YYYY - HH:mm A"
            )}
          </div>
        }
        onClose={onClose}
        width={500}
      >
        <div className={styles.drawer_top}>
          <a
            href={dispatchDetails.dispatch_order_file_url}
            target="_blank"
            className="button_secondary"
          >
            <img src={Download} alt="download" /> Download PDF
          </a>
          <button
            className="button_secondary"
            onClick={() => setOpenLRUpdate(true)}
          >
            <img src={EditIcon} alt="edit" />
            Edit
          </button>
        </div>
        <div className={styles.drawer_section}>
          <div className={styles.drawer_detail}>
            {detailList.map((detail) => (
              <div key={detail.label}>
                <div>{detail.label}</div>
                <div>
                  <WrapText width={200}>{detail.value}</WrapText>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginTop: 20, marginBottom: 10 }}>
              Files
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {dispatchDetails.lr_images_url?.map((item, index) => {
                let type = imgFormatCheck(item.url);
                return (
                  <div>
                    {type ? (
                      <div
                        style={{ margin: "6px 6px 2px 6px", cursor: "pointer" }}
                        onClick={() =>
                          setPreviewImage({ open: true, url: item.url })
                        }
                      >
                        <img
                          src={item.url}
                          alt="img"
                          key={index}
                          style={{ height: 88, width: 88, borderRadius: "5px" }}
                        />
                      </div>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        className={styles.download_link}
                        style={{
                          width: "88px",
                          height: "88px",
                          display: "flex",
                          justifyContent: "center",
                          border: "1px solid #e3e3e3",
                          borderRadius: "5px",
                          margin: "6px 6px 2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        <img src={pdfIcon} alt="pdf" width={80} height={80} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginTop: 20, marginBottom: 10 }}>
              Notes
            </div>
            <div
              style={{
                color: "#727176",
              }}
            >
              {dispatchDetails.notes}
            </div>
          </div>
        </div>
        <div className={styles.drawer_section}>
          <div className={styles.drawer_total}>
            <div>
              <div>Total Items</div>
              <div>{dispatchDetails.items?.length}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>Dispatch Value</div>
              <div>{toIndianCurrency(dispatchDetails.total_amount)}</div>
            </div>
          </div>
        </div>

        {dispatchDetails.items?.map((item, index) => (
          <div
            key={index}
            className={`${styles.drawer_section} ${styles.product_section}`}
          >
            <div>
              <img
                src={item.display_pic_url}
                alt="icon"
                width={90}
                height={90}
              />
              <div style={{ width: "100%", lineHeight: 2 }}>
                <div className={styles.product_name}>
                  {item.name} {toIndianCurrency(item.price)}
                </div>
                <div className={styles.product_category}>
                  {item.category}
                  {item.variant_name && "| " + item.variant_name}
                </div>
                <div className={styles.product_category}>
                  QTY. :{" "}
                  <span style={{ color: "#000" }}>
                    {item.packaging_size} X {item.packaging_unit}
                  </span>
                </div>
                <div className={styles.product_category}>
                  Buy Price. :{" "}
                  <span style={{ color: "#000" }}>
                    {toIndianCurrency(item.price)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.product_footer}>
              <div>
                Ordered : <span style={{ color: "#000" }}>{item.qty}</span>
              </div>
              <div>
                Shipped :{" "}
                <span style={{ color: "#000" }}>{item.dispatch_qty}</span>
              </div>
            </div>
          </div>
        ))}
      </Drawer>
      <DispatchHistoryView
        detail={dispatchDetails}
        {...{ openLRUpdate, setOpenLRUpdate }}
      />
      <ImageViewer {...{ previewImage, setPreviewImage }} />
    </>
  );
};
