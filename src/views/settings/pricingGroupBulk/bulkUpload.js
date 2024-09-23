import React, { useEffect, useState } from "react";
import { ArrowLeft, Download } from "../../../assets/globle";
import { useNavigate } from "react-router-dom";
import styles from "./builUpload.module.css";
import { Button, Table, Tooltip, notification } from "antd";
import axios from "axios";
import { BASE_URL_V1, auth_token } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkNewUploadService,
  bulkUploadingService,
} from "../../../redux/action/bulkUploading";
import moment from "moment";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useRef } from "react";

const BulkUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { bulkUploadingCsv, bulkNewUploading } = state;
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  const [fileList, setFileList] = useState([]);
  const [uploadFileId, setUploadFileId] = useState("");
  const fileInputRef = useRef();

  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bulkUploadList, setBulkUploadList] = useState([]);

  function handleSelect(e) {
    let files = e.target.files[0];
    setFileList(files);
  }

  let arrId = [];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (fileList.length === 0)
      return notification.warning({
        message: "Please Upload a New File Before Uploading",
      });
    if (fileList) {
      let type = fileList.name.split(".")[1] === "csv" ? "document" : "archive";
      let content_type = fileList.name.split(".")[1];
      var formdata_s3_1 = new FormData();
      formdata_s3_1.append("type", type);
      formdata_s3_1.append("file_name", fileList.name);
      formdata_s3_1.append("content_type", content_type);

      //image s3 uplaod api

      try {
        const response_s3_1 = await axios({
          method: "post",
          headers: {
            Authorization: auth_token,
          },
          url: `${BASE_URL_V1}/s3/upload/`,
          data: formdata_s3_1,
        });
        arrId = [...arrId, Number(response_s3_1.data.data[0].id)];

        let formdata_s3_2 = new FormData();
        formdata_s3_2.append("key", response_s3_1.headers.key);
        formdata_s3_2.append(
          "x-amz-algorithm",
          response_s3_1.headers.x_amz_algorithm
        );
        formdata_s3_2.append(
          "x-amz-signature",
          response_s3_1.headers.x_amz_signature
        );
        formdata_s3_2.append("x-amz-date", response_s3_1.headers.x_amz_date);
        formdata_s3_2.append("Policy", response_s3_1.headers.policy);
        formdata_s3_2.append(
          "success_action_status",
          response_s3_1.data.data[0].success_action_status
        );
        formdata_s3_2.append(
          "x-amz-credential",
          response_s3_1.headers.x_amz_credential
        );
        formdata_s3_2.append(
          "Content-Type",
          response_s3_1.data.data[0].content_type
        );
        formdata_s3_2.append(
          "Content-Disposition",
          response_s3_1.data.data[0].content_disposition
        );
        formdata_s3_2.append("acl", response_s3_1.data.data[0].acl);
        formdata_s3_2.append("file", fileList, fileList.name);

        try {
          //image upload api
          await axios({
            method: "post",
            data: formdata_s3_2,
            url: response_s3_1.headers.upload_url,
          });

          try {
            // image uplaod comfirm api
            const confirm = await axios({
              method: "post",
              headers: {
                Authorization: auth_token,
              },
              url: `${BASE_URL_V1}/s3/confirm/`,
              data: {
                file_id: response_s3_1.data.data[0].id,
              },
            });
            let id = confirm.data.data.id;

            setUploadFileId(id);
          } catch (error) {
            notification.warning({
              message: `${error.response.data.message}`,
            });
          }
        } catch (error) {
          notification.warning({
            message: `${error.response.data.message}`,
          });
        }
      } catch (error) {
        notification.warning({
          message: `${error.response.data.message}`,
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!uploadFileId)
      return notification.warning({
        message: "Please Upload a New File Before Submission",
      });
    const apiData = {
      module: "PPGM",
      upload_file: uploadFileId,
      pg_id: id,
    };
    dispatch(bulkNewUploadService(apiData));
    fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (bulkUploadingCsv.data && !bulkUploadingCsv.data.data.error) {
      bulkUploadingCsv.data.data.data.map((ele) => {
        ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
        // ele.total_amount = '₹ ' + ele.total_amount
      });
      setBulkUploadList(bulkUploadingCsv.data.data.data);
    }
    if (bulkNewUploading?.data && !bulkNewUploading.data.data.error) {
      setFileList([]);
      setUploadFileId("");
    }
  }, [state]);

  useEffect(() => {
    dispatch(bulkUploadingService("PPGM", pageCount));
    setLoading(false);
  }, [pageCount]);

  //pagination handle page count plus
  const handleAdd = () => {
    setPageCount(pageCount + 1);
  };

  //pagination handle page count plus
  const handleRemove = () => {
    if (pageCount === 1) {
      return;
    }
    setPageCount(pageCount - 1);
  };

  return (
    <div className={styles.bulk_container}>
      <div className={styles.header}>
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          width={20}
        />
        &nbsp; Bulk Upload
      </div>
      <div className={styles.header_bottom}>Upload CSV File</div>
      <div className={styles.top_section}>
        <br />
        <div className={styles.card}>
          Upload CSV File <span style={{ color: "red" }}>*</span>
          <br />
          <br />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              aria-label="Upload"
              onChange={(e) => {
                handleSelect(e);
              }}
            />
            <button
              onClick={handleUpload}
              disabled={uploadFileId !== ""}
              className={`${uploadFileId ? styles.disable : ""}`}
            >
              Upload
            </button>
          </div>
        </div>
        <div className={styles.upload_button_group}>
          <div>
            Download Product Pricing Sample Files
            <a
              href={
                "https://prod-rupyz-data.rupyz.com/static/documents/pub/bulk-upload-csv/product_pricing_group.csv"
              }
            >
              <img src={Download} />
            </a>
          </div>
          <div>
            <button
              className="button_secondary"
              onClick={() => {
                setFileList([]);
                setUploadFileId("");
              }}
            >
              Cancel
            </button>
            <button className="button_primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className={styles.bottom_section}>
        <div className={styles.header} style={{ marginBottom: 15 }}>
          Bulk Uploading Pricing Group List
        </div>
        <Table
          loading={loading}
          dataSource={bulkUploadList}
          columns={columns}
          pagination={false}
        />
        <div className="pagination-container">
          <div>
            <Button
              disabled={pageCount === 1 && true}
              onClick={() => {
                handleRemove();
                setLoading(true);
              }}
              className="pagenation-icon"
            >
              <CaretLeftOutlined />
            </Button>
            <div className="Pagination-count">Page {pageCount}</div>
            <Button
              disabled={bulkUploadList.length < 30 ? true : false}
              onClick={() => {
                handleAdd();
                setLoading(true);
              }}
              className="pagenation-icon"
            >
              <CaretRightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;

const columns = [
  {
    title: "Created By",
    dataIndex: "created_by_name",
    key: "name",
  },
  {
    title: "Create At",
    dataIndex: "created_at",
    key: "age",
  },
  {
    title: "Module",
    dataIndex: "module",
    key: "age",
    render: (_, { module }) => {
      return <div key={module}>{"Product Pricing"}</div>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "tag",
    align: "center",
    render: (_, record) => {
      let color =
        record.status === "PENDING"
          ? "#EF9834"
          : record.status === "PROCESSED"
          ? "#389E0D"
          : record.status === "FAILED"
          ? "#F00"
          : record.status === "INITIATED" && "#0958D9";
      let background =
        record.status === "PENDING"
          ? "#FEF8F1"
          : record.status === "PROCESSED"
          ? "#CFFED8"
          : record.status === "FAILED"
          ? "#F9D9DA"
          : record.status === "INITIATED" && "#E6F4FF";
      return (
        <Tooltip
          placement="bottomLeft"
          title={`Total : ${
            record.count_dict.failed_count +
            record.count_dict.updated_count +
            record.count_dict.created_count
          } (Failed : ${record.count_dict.failed_count}, Updated : ${
            record.count_dict.updated_count
          }, New : ${record.count_dict.created_count})`}
        >
          <div
            style={{
              color: color,
              background: background,
              borderRadius: "8px",
              padding: "5px 0",
              border: "2px solid #fff",
              width: 120,
              margin: "auto",
            }}
          >
            {record.status}
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: "Failed Reason",
    dataIndex: "upload_errors",
    key: "age",
    render: (text) => (
      <div
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          width: 90,
          whiteSpace: "nowrap",
        }}
      >
        <Tooltip placement="right" title={text}>
          {text}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Uploaded File",
    dataIndex: "upload_file_url",
    key: "upload_file_url",
    align: "center",
    render: (_, { upload_file_url }) => {
      return (
        upload_file_url && (
          <a href={upload_file_url} target="_blank">
            <img
              src={Download}
              alt="download"
              style={{
                width: 45,
                margin: "auto",
                padding: "5px 10px",
                borderRadius: 5,
                background: "#EAECF7",
              }}
            />
          </a>
        )
      );
    },
  },
  {
    title: "Result",
    dataIndex: "log_file_url",
    key: "log_file_url",
    align: "center",
    render: (_, { log_file_url }) => {
      return (
        log_file_url && (
          <a href={log_file_url} target="_blank">
            <img
              src={Download}
              alt="download"
              style={{
                width: 45,
                margin: "auto",
                padding: "5px 10px",
                borderRadius: 5,
                background: "#EAECF7",
              }}
            />
          </a>
        )
      );
    },
  },
];
