import { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Tooltip } from "antd";
import moment from "moment";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { bulkUploadingService } from "../../redux/action/bulkUploading";
import BulkUploadingCSV from "../../components/viewDrawer/bulkUploadingCsv";
import filterService from "../../services/filter-service";
import Paginator from "../../components/pagination";
import { capitalizeFirst } from "../distributor";

const BulkCustomerBeatMap = () => {
  const context = useContext(Context);
  const { setModuleData, setBulkUploadCSVOpen, setLoading } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [apiData, setApiData] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    ...filterService.getFilters(),
  });

  useEffect(() => {
    if (state.bulkUploadingCsv.data !== "") {
      if (state.bulkUploadingCsv.data.data.error === false) {
        state.bulkUploadingCsv.data.data.data.map((ele) => {
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
        });
        setApiData(state.bulkUploadingCsv.data.data.data);
      }
    }
  }, [state]);

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
          <Tag color={color} key={module} style={{ fontSize: 13 }}>
            {capitalizeFirst(module).split("-").join(" ")}
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
            {text || "N/A"}
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
          <div>
            {upload_file_url !== "" ? (
              <a
                className="button_primary"
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
      align: "center",
      render: (_, { log_file_url }) => {
        return (
          <div>
            {log_file_url !== "" ? (
              <a className="button_primary" href={log_file_url} target="_blank">
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
    alignItems: "end",
    margin: "20px 0",
  };

  //get paginatin data from get api
  useEffect(() => {
    dispatch(bulkUploadingService("ASSIGN-BEAT-CUSTOMERS", activeFilters.page));
  }, [activeFilters]);

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  return (
    <div>
      <div style={styleHeader}>
        <h2 className="page_title">Customer-Beat Mapping Bulk Uploading</h2>
        <Button
          className="button_primary"
          onClick={() => {
            setModuleData("ASSIGN-BEAT-CUSTOMERS");
            setBulkUploadCSVOpen(true);
          }}
          style={{ height: 40 }}
        >
          Bulk Upload CSV
        </Button>
      </div>
      <Table dataSource={apiData} columns={columns} pagination={false} />
      <br />
      <Paginator
        limiter={(apiData || []).length < 30}
        value={activeFilters["page"]}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <BulkUploadingCSV />
    </div>
  );
};

export default BulkCustomerBeatMap;
