import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import {
  CloseOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, Upload, Badge } from "antd";
//api called
import { auth_token, BASE_URL_V1 } from "../../config";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { reimbursementItemEditService } from "../../redux/action/reimbursementAction";
import moment from "moment";
import styles from "../viewDrawer/order.module.css";
import Cookies from "universal-cookie";

const EditReimbursementItem = ({ data }) => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const {
    editReimbursementItemOpen,
    setEditReimbursementItemOpen,
    editReimbursementData,
    setEditReimbursementData,
  } = context;
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [formInput, setFormInput] = useState("");
  const [fileList, setFileList] = useState(data.bill_proof_urls);
  const [imgIdList, setImgIdList] = useState("");
  const [imgUrlList, setImgUrlList] = useState("");

  const [imgArray, setImgArray] = useState("");

  const defaultData = data;

  const cookies = new Cookies();

  const onClose = () => {
    setEditReimbursementItemOpen(false);
    setEditReimbursementData("");
  };

  let array1 = [];
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileList.length !== 0) {
      fileList &&
        fileList.map((item, index) => {
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
                      let apiData = {
                        id: defaultData.id,
                        name: expenseName ? expenseName : defaultData.name,
                        amount: amount
                          ? parseFloat(amount)
                          : defaultData.amount,
                        bill_proof: array1 ? array1 : defaultData.bill_proof,
                        description: description !== "" ? description : "",
                      };
                      dispatch(
                        reimbursementItemEditService(apiData, defaultData.id)
                      );
                    })
                    .catch((error2) => console.warn(error2));
                })
                .catch((error1) => console.warn(error1));
            })
            .catch((error) => console.warn(error));
        });
    } else {
      let apiData = {
        id: data.id,
        name: expenseName ? expenseName : data.name,
        amount: amount ? parseFloat(amount) : data.amount,
        bill_proof: array1 ? array1 : data.bill_proof,
        description: description !== "" ? description : "",
      };
      dispatch(reimbursementItemEditService(apiData, defaultData.id));
    }
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <>
      {editReimbursementData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> <span>Edit Expense</span>{" "}
            </>
          }
          width={500}
          closable={false}
          onClose={onClose}
          open={editReimbursementItemOpen}
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
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item style={{ fontWeight: "600" }} label="Title" name="name">
              <Input
                defaultValue={data.name}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              style={{ fontWeight: "600" }}
              label="Description"
              name="description"
            >
              <TextArea
                defaultValue={data.description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              style={{ fontWeight: "600" }}
              label="Amount"
              name="amount"
            >
              <Input
                defaultValue={data.amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Upload Photos / Docs :</div>
              <div>
                <Upload
                  listType="picture-card"
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
                Update
              </Button>
              <Button style={{ margin: "50px 0 20px 20px" }} onClick={onClose}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};
export default EditReimbursementItem;
