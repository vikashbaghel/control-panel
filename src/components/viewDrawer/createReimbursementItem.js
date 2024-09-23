import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Drawer,
  Button,
  Form,
  Input,
  Upload,
  Badge,
  DatePicker,
  Space,
} from "antd";
//api called
import { auth_token, BASE_URL_V1 } from "../../config";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import {
  addReimbursementItemService,
  reibursementService,
} from "../../redux/action/reimbursementAction";
import moment from "moment";
import styles from "../viewDrawer/order.module.css";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";

const CreateReimbursementItem = () => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const {
    editReimbursementData,
    createReimbursementItemOpen,
    setCreateReimbursementItemOpen,
  } = context;
  const [form] = Form.useForm();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expense_date_time, setExpense_date_time] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imgUrlList, setImgUrlList] = useState("");

  const cookies = new Cookies();
  const onClose = () => {
    setCreateReimbursementItemOpen(false);
  };

  let array1 = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileList.length !== 0)
      fileList &&
        fileList.map((item, index) => {
          let type =
            item.type.split("/")[1] === "zip"
              ? "archive"
              : item.type.split("/")[1] === "jpg" ||
                item.type.split("/")[1] === "png" ||
                item.type.split("/")[1] === "jpeg"
              ? "image"
              : "document";
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
              formData1.append(
                "x-amz-algorithm",
                response.headers.x_amz_algorithm
              );
              formData1.append(
                "x-amz-signature",
                response.headers.x_amz_signature
              );
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
              formData1.append(
                "Content-Type",
                response.data.data[0].content_type
              );
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
                  if (response1.data.error === true) {
                  }
                  const url = `${BASE_URL_V1}/s3/confirm/`;
                  const data = { file_id: response.data.data[0].id };
                  const headers = { Authorization: auth_token };
                  axios
                    .post(url, data, { headers })
                    .then((response2) => {
                      array1.push(response2.data.data.id);
                      setImgUrlList(array1);
                      if (fileList.length === array1.length) {
                        let apiData = {
                          reimbursementtracker: editReimbursementData.id,
                          name: expenseName,
                          amount: roundToDecimalPlaces(amount),
                          bill_proof: array1,
                          description: description !== "" ? description : "",
                          expense_date_time:
                            moment(expense_date_time).format(
                              "YYYY-MM-DDTh:mm:ss"
                            ),
                        };
                        dispatch(addReimbursementItemService(apiData));
                        setTimeout(() => {
                          window.location.reload();
                          dispatch(reibursementService());
                        }, 500);

                        setCreateReimbursementItemOpen(false);
                      }
                    })
                    .catch((error2) => console.warn(error2));
                })
                .catch((error1) => console.warn(error1));
            })
            .catch((error) => console.warn(error));
        });
    else {
      let apiData = {
        reimbursementtracker: editReimbursementData.id,
        name: expenseName,
        amount: roundToDecimalPlaces(amount),
        description: description !== "" ? description : "",
        expense_date_time:
          moment(expense_date_time).format("YYYY-MM-DDTh:mm:ss"),
      };
      dispatch(addReimbursementItemService(apiData));
      dispatch(reibursementService());
      setCreateReimbursementItemOpen(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const dateFormat = "YYYY-MM-DD";

  const onSelectStartDate = (date, dateString) => {
    setExpense_date_time(dateString);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    let start = moment(editReimbursementData.start_date_time)
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    let end = moment(editReimbursementData.end_date_time).format("YYYY-MM-DD");
    return (
      current &&
      (current < dayjs(start).endOf("day") || current > dayjs(end).endOf("day"))
    );
  };

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> <span>Add Expense</span>{" "}
          </>
        }
        width={500}
        closable={false}
        onClose={onClose}
        open={createReimbursementItemOpen}
        style={{ overflowY: "auto" }}
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
          // onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ fontWeight: "600" }}
            label="Title"
            name="name"
            required
          >
            <Input onChange={(e) => setExpenseName(e.target.value)} required />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="Description"
            name="description"
          >
            <TextArea onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="Amount"
            name="amount"
            required
          >
            <Input
              onChange={(e) => setAmount(e.target.value)}
              required
              type="number"
            />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="Expense Date"
            name="expense_date_time"
            required
          >
            {/* <Input type="date" onChange={(e) => setExpense_date_time(e.target.value)} required/> */}
            <Space direction="vertical" width={200} required="true">
              <DatePicker
                format={dateFormat}
                style={{ width: "200px" }}
                onChange={onSelectStartDate}
                required="true"
                disabledDate={disabledDate}
              />
            </Space>
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "600" }}>Upload Photos / Docs :</div>
            <div>
              <Upload
                listType="picture-card"
                maxCount={6}
                multiple
                fileList={fileList}
                beforeUpload={(file) => {
                  setFileList([...fileList, file]);
                  return false;
                }}
                onChange={onChange}
                onRemove={(file) => {
                  const index = fileList.indexOf(file);
                  let arr = [...fileList];
                  arr.splice(index, 1);
                  setFileList(arr);
                }}
                showUploadList={{ showPreviewIcon: false }}
                itemRender={(element, file) => {
                  return (
                    <Badge color="#fff" offset={[-3, 3]}>
                      <div style={styles.thumbnail}>{element}</div>
                    </Badge>
                  );
                }}
              >
                {" "}
                <UploadOutlined />
              </Upload>
            </div>
          </div>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Create
            </Button>
            <Button style={{ margin: "50px 0 20px 20px" }} onClick={onClose}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateReimbursementItem;
