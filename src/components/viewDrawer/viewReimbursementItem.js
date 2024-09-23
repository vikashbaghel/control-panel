import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import {
  CloseCircleTwoTone,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Drawer, Button, Card, Popconfirm } from "antd";
//api called
import {
  reibursementItemDetailsService,
  reimbursementItemDeleteService,
} from "../../redux/action/reimbursementAction";
import moment from "moment";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { useEffect } from "react";
import EditReimbursementItem from "./editReimbursementItem";
import styles from "../viewDrawer/order.module.css";
import eyeIcon from "../../assets/eye.svg";
import ModalForImagePreview from "../modalForImagePreview/ModalForPreview";

const ViewReimbursementItem = () => {
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const [reibursementItemDetails, setReibursementItemDetails] = useState([]);
  const dispatch = useDispatch();
  const {
    viewReimbursementItemOpen,
    setViewReimbursementItemOpen,
    editReimbursementItemData,
    setEditReimbursementItemData,
    setEditReimbursementItemOpen,
    approvalReimbursementItemData,
    editReimbursementData,
    setPreviewOpen,
    setPreviewImage,
  } = context;

  const onClose = () => {
    setViewReimbursementItemOpen(false);
    setEditReimbursementItemData("");
  };

  useEffect(() => {
    dispatch(reibursementItemDetailsService(editReimbursementItemData));
  }, [editReimbursementItemData]);

  useEffect(() => {
    if (state.getReimbursementItemDetails.data !== "") {
      if (state.getReimbursementItemDetails.data.data.error === false) {
        setReibursementItemDetails(
          state.getReimbursementItemDetails.data.data.data
        );
      }
    }
  }, [state]);

  return (
    <>
      {approvalReimbursementItemData === true
        ? editReimbursementItemData && (
            <Drawer
              className="container"
              title={
                <>
                  <CloseOutlined onClick={onClose} />{" "}
                  <span>Expense Details</span>{" "}
                </>
              }
              width={500}
              closable={false}
              onClose={onClose}
              open={viewReimbursementItemOpen}
              style={{ overflowY: "auto" }}
            >
              <div>
                <div>
                  <Card
                    // title={editReimbursementData.name}
                    bordered={false}
                    style={{
                      background:
                        "transparent linear-gradient(101deg, #f2faffb3 0%, #fdf1fd66 100%) 0% 0% no-repeat padding-box",
                    }}
                  >
                    <div>
                      <div>
                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "rgb(91 88 88)" }}>Amount</h5>
                          <div>
                            <h3 style={{ color: "#312B81", fontSize: "24px" }}>
                              {toIndianCurrency(reibursementItemDetails.amount)}
                            </h3>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "rgb(91 88 88)" }}>Date</h5>
                          <div>
                            <h4>
                              {moment(
                                reibursementItemDetails.expense_date_time
                              ).format("DD-MM-YYYY")}
                            </h4>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "rgb(91 88 88)" }}>Title</h5>
                          <div>
                            <h4 style={{ fontSize: "20px" }}>
                              {reibursementItemDetails.name}
                            </h4>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "rgb(91 88 88)" }}>
                            Description
                          </h5>
                          <div>
                            <p style={{ fontSize: "15px" }}>
                              {reibursementItemDetails.description
                                ? reibursementItemDetails.description
                                : "No Any Description"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 style={{ color: "rgb(91 88 88)" }}>
                            Photos / Docs
                          </h5>
                          <div className={styles.img_view}>
                            {reibursementItemDetails &&
                              reibursementItemDetails.bill_proof_urls &&
                              reibursementItemDetails.bill_proof_urls.map(
                                (data, index) => {
                                  const url = data.url;
                                  // Extract file extension using regular expression
                                  const extension = url.match(/\.([^.]+)$/)[1];
                                  return (
                                    <div
                                      style={{ position: "relative" }}
                                      className={
                                        styles.view_img_preview_container
                                      }
                                    >
                                      <div>
                                        <img
                                          width="88px"
                                          height="88px"
                                          style={{ margin: "6px 6px 2px 6px" }}
                                          src={data.url}
                                        />
                                      </div>
                                      <img
                                        width={30}
                                        src={eyeIcon}
                                        alt="View"
                                        className={styles.view_img_preview}
                                        onClick={() => {
                                          setPreviewOpen(true);
                                          setPreviewImage(data.url);
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              <EditReimbursementItem data={reibursementItemDetails} />
              <ModalForImagePreview />
            </Drawer>
          )
        : editReimbursementItemData && (
            <Drawer
              className="container"
              title={
                <>
                  <CloseOutlined onClick={onClose} />{" "}
                  <span>Expense Details</span>{" "}
                </>
              }
              width={500}
              closable={false}
              onClose={onClose}
              open={viewReimbursementItemOpen}
              style={{ overflowY: "auto" }}
            >
              <div>
                {editReimbursementData.status === "Submitted" ||
                editReimbursementData.status === "Approved" ? (
                  <></>
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      type="primary"
                      style={{ background: "red", marginBottom: "10px" }}
                    >
                      <Popconfirm
                        title="Are You Sure, You want to Delete Expense ?"
                        okText="Yes"
                        placement="leftTop"
                        // onConfirm={() => handleDeleteProduct()}
                        onConfirm={() =>
                          editReimbursementItemData
                            ? dispatch(
                                reimbursementItemDeleteService(
                                  editReimbursementItemData
                                )
                              )
                            : ""
                        }
                      >
                        <CloseCircleTwoTone twoToneColor="red" /> Delete
                      </Popconfirm>
                    </Button>

                    <Button
                      type="primary"
                      style={{ marginBottom: "10px" }}
                      onClick={() => {
                        setEditReimbursementItemOpen(true);
                      }}
                    >
                      <EditOutlined /> Edit
                    </Button>
                  </div>
                )}

                <div>
                  <Card
                    bordered={false}
                    style={{
                      background:
                        "transparent linear-gradient(101deg, #f2faffb3 0%, #fdf1fd66 100%) 0% 0% no-repeat padding-box",
                    }}
                  >
                    <div>
                      <div>
                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "#B7B7B7" }}>Amount</h5>
                          <div>
                            <h3 style={{ color: "#312B81", fontSize: "24px" }}>
                              {toIndianCurrency(reibursementItemDetails.amount)}
                            </h3>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "#B7B7B7" }}>Date</h5>
                          <div>
                            <h4>
                              {moment(
                                reibursementItemDetails.expense_date_time
                              ).format("DD-MM-YYYY")}
                            </h4>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "#B7B7B7" }}>Title</h5>
                          <div>
                            <h4 style={{ fontSize: "20px" }}>
                              {reibursementItemDetails.name}
                            </h4>
                          </div>
                        </div>

                        <div style={{ borderBottom: "2px solid #0000001A" }}>
                          <h5 style={{ color: "#B7B7B7" }}>Description</h5>
                          <div>
                            <p style={{ fontSize: "15px" }}>
                              {reibursementItemDetails.description
                                ? reibursementItemDetails.description
                                : "No Any Description"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 style={{ color: "#B7B7B7" }}>Photos / Docs</h5>
                          <div className={styles.img_view}>
                            {reibursementItemDetails &&
                              reibursementItemDetails.bill_proof_urls &&
                              reibursementItemDetails.bill_proof_urls.map(
                                (data, index) => {
                                  const url = data.url;
                                  // Extract file extension using regular expression
                                  const extension = url
                                    .match(/\.([^.]+)$/)[0]
                                    .split("?");
                                  return (
                                    <div
                                      style={{ position: "relative" }}
                                      className={
                                        styles.view_img_preview_container
                                      }
                                    >
                                      {extension[0] === ".pdf" ? (
                                        <>
                                          <div
                                            class="slds-form-element"
                                            style={{ border: "1px solid gray" }}
                                          >
                                            <a href={data.url} target="_blank">
                                              View File
                                            </a>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div>
                                            <img
                                              width="88px"
                                              height="88px"
                                              style={{
                                                margin: "6px 6px 2px 6px",
                                              }}
                                              src={data.url}
                                            />
                                          </div>
                                          <img
                                            width={30}
                                            src={eyeIcon}
                                            alt="View"
                                            className={styles.view_img_preview}
                                            onClick={() => {
                                              setPreviewOpen(true);
                                              setPreviewImage(data.url);
                                            }}
                                          />
                                        </>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              <EditReimbursementItem data={reibursementItemDetails} />
              <ModalForImagePreview />
            </Drawer>
          )}
    </>
  );
};
export default ViewReimbursementItem;
