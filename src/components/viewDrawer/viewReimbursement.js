import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, Card, Modal } from "antd";
//api called
import TextArea from "antd/es/input/TextArea";
import {
  reibursementListService,
  reibursementService,
  reimbursementDeleteService,
  reimbursementEditService,
} from "../../redux/action/reimbursementAction";
import moment from "moment";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { useEffect } from "react";
import CreateReimbursementItem from "./createReimbursementItem";
import ViewReimbursementItem from "./viewReimbursementItem";
import { ApprovedreimbursementService } from "../../redux/action/approvalReimbursementAction";

const ViewReimbursement = ({ pageNumber }) => {
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const [reibursementList, setReibursementList] = useState([]);
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const {
    viewReimbursementOpen,
    setViewReimbursementOpen,
    editReimbursementData,
    setEditReimbursementData,
    setViewReimbursementItemOpen,
    setCreateReimbursementItemOpen,
    setEditReimbursementItemData,
    approvalReimbursementItemData,
    setApprovalReimbursementItemData,
  } = context;
  const [formInput, setFormInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [end_date_time, setEndDate] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showSubmittedModal = () => {
    setIsSubmittedModalOpen(true);
  };

  const showDeletedModal = () => {
    setIsDeletedModalOpen(true);
  };

  const handleOk = () => {
    const apiData = {
      status: "Rejected",
      comments: comments,
    };
    setFormInput(apiData);
    dispatch(ApprovedreimbursementService(apiData, editReimbursementData.id));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmittedCancel = () => {
    setIsSubmittedModalOpen(false);
  };

  const handleDeletedCancel = () => {
    setIsDeletedModalOpen(false);
  };

  const onClose = () => {
    setViewReimbursementOpen(false);
    setEditReimbursementData("");
    setApprovalReimbursementItemData(false);
    // setReibursementList("");
  };

  useEffect(() => {
    dispatch(reibursementListService(editReimbursementData.id));
  }, [editReimbursementData]);

  const onHandleApprove = () => {
    const apiData = {
      status: "Approved",
    };
    setFormInput(apiData);
    dispatch(ApprovedreimbursementService(apiData, editReimbursementData.id));
  };

  const onHandleSubmitted = () => {
    const apiData = {
      status: "Submitted",
      id: editReimbursementData.id,
      end_date_time: end_date_time
        ? moment(end_date_time).format("YYYY-MM-DDTh:mm:ss")
        : editReimbursementData.end_date_time
        ? moment(editReimbursementData.end_date_time).format(
            "YYYY-MM-DDTh:mm:ss"
          )
        : "",
    };
    setFormInput(apiData);
    dispatch(reimbursementEditService(apiData, editReimbursementData.id));
    setIsSubmittedModalOpen(false);
  };

  const onHandleReject = () => {
    const apiData = {
      status: "Rejected",
    };
    setFormInput(apiData);
    dispatch(ApprovedreimbursementService(apiData, editReimbursementData.id));
  };

  useEffect(() => {
    if (state.getReibursmentList.data !== "") {
      if (state.getReibursmentList.data.data.error === false) {
        setReibursementList(state.getReibursmentList.data.data.data);
      }
    }
    if (state.editReibursement.data !== "") {
      if (state.editReibursement.data.data.error === false) {
        onClose();
        setTimeout(() => {
          dispatch(reibursementService("", pageNumber));
        }, 500);
      }
    }
  }, [state]);

  return (
    <>
      {approvalReimbursementItemData === true ? (
        editReimbursementData && (
          <Drawer
            className="container"
            title={
              <>
                <CloseOutlined onClick={onClose} />{" "}
                <span> View Expense Head</span>{" "}
              </>
            }
            width={500}
            closable={false}
            onClose={onClose}
            open={viewReimbursementOpen}
            style={{ overflowY: "auto" }}
          >
            <div>
              <div>
                <Card
                  // title={editReimbursementData.name}
                  bordered={false}
                >
                  <div>
                    {editReimbursementData.is_resubmitted ? (
                      <h3
                        style={{
                          color: "blue",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        Re-Submitted
                      </h3>
                    ) : (
                      ""
                    )}
                    <h5 style={{ color: "#B7B7B7" }}>Expense Head</h5>
                    <div>
                      <div>
                        <h3 style={{ color: "#363636" }}>
                          {editReimbursementData.name}
                        </h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ color: "#0E69E1" }}>
                          {moment(editReimbursementData.start_date_time).format(
                            "DD-MM-YYYY"
                          )}
                          &nbsp; - &nbsp;
                          {moment(editReimbursementData.end_date_time).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            marginTop: "-8px",
                          }}
                        >
                          {editReimbursementData.total_amount > 0
                            ? toIndianCurrency(
                                editReimbursementData.total_amount
                              )
                            : "₹ 0.00"}
                        </div>
                      </div>
                    </div>
                    {editReimbursementData.description !== null ? (
                      <div
                        style={{
                          border: "1px solid #707070",
                          padding: "10px",
                          borderRadius: "5px",
                          marginTop: "5px",
                        }}
                      >
                        {editReimbursementData.description}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Card>
                <div>
                  <h5 style={{ color: "#B7B7B7" }}>List of Expenses</h5>
                  <div>
                    {reibursementList &&
                      reibursementList.map((item, index) => {
                        return (
                          <Card
                            key={index}
                            style={{
                              marginBottom: "20px",
                              cursor: "pointer",
                              background:
                                "transparent linear-gradient(101deg, #f2faffb3 0%, #fdf1fd66 100%) 0% 0% no-repeat padding-box",
                            }}
                            onClick={() => {
                              setViewReimbursementItemOpen(true);
                              setEditReimbursementItemData(item.id);
                              // dispatch(reibursementListService(reibursementList.id));
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  {moment(item.expense_date_time).format(
                                    "DD-MM-YYYY"
                                  )}
                                  <h3>{item.name}</h3>
                                  <div>{item.description}</div>
                                </div>
                                <div>
                                  <h2> {toIndianCurrency(item.amount)} </h2>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </div>

                {editReimbursementData.status === "Approved" ||
                editReimbursementData.status === "Rejected" ? (
                  <></>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-between",
                        gap: "10px",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{
                          background: "Red",
                          marginBottom: "10px",
                          width: "220px",
                        }}
                        onClick={showModal}
                      >
                        Reject
                      </Button>

                      <Modal
                        title="Reject Reason"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        <Form
                          name="basic"
                          labelCol={{
                            span: 8,
                          }}
                          wrapperCol={{
                            span: 16,
                          }}
                          style={{
                            maxWidth: 500,
                          }}
                          initialValues={{
                            remember: true,
                          }}
                          autoComplete="off"
                        >
                          <Form.Item
                            style={{ fontWeight: "600" }}
                            name="comments"
                          >
                            <TextArea
                              onChange={(e) => setComments(e.target.value)}
                            />
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Button
                        type="primary"
                        style={{
                          background: "Green",
                          marginBottom: "10px",
                          width: "220px",
                        }}
                        onClick={onHandleApprove}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <CreateReimbursementItem />
            <ViewReimbursementItem />
          </Drawer>
        )
      ) : (
        <Drawer
          className="container"
          title={
            <div style={{ display: "flex" }}>
              <CloseOutlined onClick={onClose} />{" "}
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "10px",
                }}
              >
                {editReimbursementData.name}
              </span>
            </div>
          }
          width={500}
          closable={false}
          onClose={onClose}
          open={viewReimbursementOpen}
          style={{ overflowY: "auto" }}
        >
          <div>
            <div>
              <Card
                // title={editReimbursementData.name}
                bordered={false}
              >
                <div>
                  <h5 style={{ color: "#B7B7B7" }}>Expense Head</h5>
                  <div>
                    <div>
                      <h3 style={{ color: "#363636" }}>
                        {editReimbursementData.name}
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ color: "#0E69E1" }}>
                        {moment(editReimbursementData.start_date_time).format(
                          "DD-MM-YYYY"
                        )}
                        &nbsp; - &nbsp;
                        {moment(editReimbursementData.end_date_time).format(
                          "DD-MM-YYYY"
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: "600",
                          marginTop: "-8px",
                        }}
                      >
                        {toIndianCurrency(editReimbursementData.total_amount)}
                      </div>
                    </div>
                  </div>
                  {editReimbursementData.description !== null ? (
                    <div
                      style={{
                        border: "1px solid #707070",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "5px",
                      }}
                    >
                      {editReimbursementData.description}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Card>
              <div>
                <h5 style={{ color: "#B7B7B7" }}>List of Expenses</h5>
                <div>
                  {reibursementList &&
                    reibursementList.map((item, index) => {
                      return (
                        <Card
                          key={index}
                          style={{
                            marginBottom: "20px",
                            cursor: "pointer",
                            background:
                              "transparent linear-gradient(101deg, #f2faffb3 0%, #fdf1fd66 100%) 0% 0% no-repeat padding-box",
                          }}
                          onClick={() => {
                            setViewReimbursementItemOpen(true);
                            setEditReimbursementItemData(item.id);
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                {moment(item.expense_date_time).format(
                                  "DD-MM-YYYY"
                                )}
                                <h3>{item.name}</h3>
                                <div>{item.description}</div>
                              </div>
                              <div>
                                <h2>{toIndianCurrency(item.amount)} </h2>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
              {(editReimbursementData &&
                editReimbursementData.status === "Active") ||
              editReimbursementData.status === "Rejected" ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-between",
                      gap: "10px",
                    }}
                  >
                    <Button
                      type="primary"
                      style={{
                        background: "Red",
                        marginBottom: "10px",
                        width: "220px",
                      }}
                      // onClick={onHandleReject}
                      onClick={showDeletedModal}
                    >
                      DELETE
                    </Button>

                    <Modal
                      open={isDeletedModalOpen}
                      onOk={() =>
                        editReimbursementData
                          ? dispatch(
                              reimbursementDeleteService(
                                editReimbursementData.id
                              )
                            )
                          : ""
                      }
                      onCancel={handleDeletedCancel}
                    >
                      <div
                        style={{
                          color: "red",
                          fontWeight: "600",
                          marginBottom: "30px",
                        }}
                      >
                        Do you want to Delete ?
                      </div>
                    </Modal>

                    <Modal
                      title={
                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "30px",
                          }}
                        >
                          Please Verify End Date ?
                        </div>
                      }
                      open={isSubmittedModalOpen}
                      onOk={onHandleSubmitted}
                      onCancel={handleSubmittedCancel}
                    >
                      <Form
                        name="basic"
                        labelCol={{
                          span: 8,
                        }}
                        wrapperCol={{
                          span: 16,
                        }}
                        style={{
                          maxWidth: 600,
                          display: "flex",
                          justifyContent: "start",
                        }}
                        initialValues={{
                          remember: true,
                        }}
                        // onFinish={onFinish}
                        autoComplete="off"
                      >
                        <Form.Item
                          style={{ fontWeight: "600" }}
                          label="End date"
                          name="end_date_time"
                        >
                          <Input
                            type="date"
                            defaultValue={moment(
                              editReimbursementData.end_date_time
                            ).format("YYYY-MM-DD")}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>

                    <Button
                      type="primary"
                      style={{
                        background: "Green",
                        marginBottom: "10px",
                        width: "220px",
                      }}
                      onClick={showSubmittedModal}
                    >
                      SUBMIT
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <CreateReimbursementItem />
          <ViewReimbursementItem />
        </Drawer>
      )}
    </>
  );
};
export default ViewReimbursement;
