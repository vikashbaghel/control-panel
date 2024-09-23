import React, { useContext, useEffect, useState } from "react";
import { theme, Table, Button, Tag, Tooltip } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { bulkUploadingService } from "../../redux/action/bulkUploading";
import BulkUploadingCSV from "../../components/viewDrawer/bulkUploadingCsv";
import { Link } from "react-router-dom";

const BulkCustomer = () => {
  const [apiData, setApiData] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const { setBulkUploadCSVOpen, setModuleData } = context;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(bulkUploadingService("CUSTOMER"));
  }, []);

  useEffect(() => {
    if (state.bulkUploadingCsv.data !== "") {
      if (state.bulkUploadingCsv.data.data.error === false) {
        state.bulkUploadingCsv.data.data.data.map((ele) => {
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          // ele.total_amount = '₹ ' + ele.total_amount
        });
        setApiData(state.bulkUploadingCsv.data.data.data);
      }
    }
  }, [state]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
        let color =
          module === "PRODUCTS"
            ? "cyan"
            : module === "STAFF"
            ? "green"
            : module === "CUSTOMER"
            ? "blue"
            : "";
        return (
          <Tag color={color} key={module}>
            {module.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "tag",
      render: (_, record, { status }) => {
        let color =
          record.status === "PENDING"
            ? "yellow"
            : record.status === "PROCESSED"
            ? "green"
            : record.status === "FAILED"
            ? "red"
            : record.status === "INITIATED"
            ? "blue"
            : "";
        return (
          <Tag color={color} key={status}>
            <Tooltip
              placement="right"
              title={`Total : ${
                record.count_dict.failed_count +
                record.count_dict.updated_count +
                record.count_dict.created_count
              } (Failed : ${record.count_dict.failed_count}, Updated : ${
                record.count_dict.updated_count
              }, New : ${record.count_dict.created_count})`}
            >
              {record.status}
            </Tooltip>
          </Tag>
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
      render: (_, { upload_file_url }) => {
        return (
          <div>
            {upload_file_url !== "" ? (
              <a
                style={{
                  background: "#1677ff",
                  height: "32px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "6px",
                  width: "80%",
                }}
                href={upload_file_url}
                target="_blank"
              >
                Download
              </a>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      title: "Result",
      dataIndex: "log_file_url",
      key: "log_file_url",
      render: (_, { log_file_url }) => {
        return (
          <div>
            {log_file_url !== "" ? (
              <a
                style={{
                  background: "#1677ff",
                  height: "32px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "6px",
                  width: "100%",
                }}
                href={log_file_url}
                target="_blank"
              >
                Download
              </a>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

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

  //get paginatin data from get api
  useEffect(() => {
    dispatch(bulkUploadingService("CUSTOMER", pageCount));
    setLoading(false);
  }, [pageCount]);

  return (
    <div>
      <h2 className="page_title">
        Bulk Customer Uploading List
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/bulk-product-customer")}>
            {" "}
            / Bulk-Uploading-Customer
          </span>
        </div>
      </h2>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          background: colorBgContainer,
        }}
      >
        <div style={styleHeader}>
          <h2 style={{ margin: "0" }}></h2>
          <Button
            type="primary"
            onClick={() => {
              setModuleData("CUSTOMER");
              setBulkUploadCSVOpen(true);
            }}
          >
            Bulk Upload CSV
          </Button>
          <BulkUploadingCSV />
        </div>
        <Table dataSource={apiData} columns={columns} pagination={false} />
      </Content>
      <br />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          disabled={pageCount === 1 ? true : false}
          type="primary"
          onClick={() => {
            handleRemove();
            setLoading(true);
          }}
        >
          {"<"}
        </Button>
        <Button style={{ marginLeft: "5px", marginRight: "5px" }}>
          {pageCount}
        </Button>
        <Button
          type="primary"
          disabled={apiData.length < 30 ? true : false}
          onClick={() => {
            handleAdd();
            setLoading(true);
          }}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default BulkCustomer;
