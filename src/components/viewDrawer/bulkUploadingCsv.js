import React, { useContext, useState } from "react";
import axios from "axios";
import { auth_token, BASE_URL_V2, org_id } from "../../config.js";
import Context from "../../context/Context";
import { Drawer, notification } from "antd";
import ImageUploader, { uploadImage } from "../image-uploader/ImageUploader.js";
import { bulkUploadingService } from "../../redux/action/bulkUploading.js";
import { useDispatch } from "react-redux";

const BulkUploadingCSV = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { bulkUploadCSVOpen, setBulkUploadCSVOpen, moduleData, setModuleData } =
    context;
  const queryParameters = new URLSearchParams(window.location.search);
  const page = queryParameters.get("page") || 1;

  const initailValue = { csv: [], zip: [], csvId: "", zipId: "" };
  const [files, setFiles] = useState(initailValue);

  const onClose = () => {
    setBulkUploadCSVOpen(false);
    setModuleData("");
    setFiles(initailValue);
  };

  const handleSelect = (e, type) => {
    setFiles((prev) => ({ ...prev, [type]: e, [`${type}Id`]: "" }));
  };

  const handleUpload = async (type) => {
    let result = "";
    if (files[type]) {
      result = await uploadImage(files[type]);
    }
    return result[0];
  };

  async function onSumbitCsv(event) {
    event.preventDefault();
    try {
      await axios({
        method: "post",
        headers: {
          Authorization: auth_token,
        },
        url: `${BASE_URL_V2}/organization/${org_id}/csvuploadlog/`,
        data: {
          upload_file: await handleUpload("csv"),
          zip_file: await handleUpload("zip"),
          module: moduleData,
        },
      }).then((response) => {
        if (response.status === 200) {
          notification.success({
            message: `${response.data.message}`,
          });
          onClose();
          dispatch(bulkUploadingService(moduleData, page));
        }
      });
    } catch (error) {
      notification.warning({
        message: `${error.response.data.message}`,
      });
    }
  }

  return (
    <>
      <Drawer
        className="container"
        title={<>Bulk Upload CSV File For {titleConstant[moduleData]}</>}
        width={450}
        onClose={onClose}
        open={bulkUploadCSVOpen}
        style={{ overflowY: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "calc(100% - 40px)",
              borderRadius: 10,
              border: "1px solid #FFF",
              padding: 20,
              margin: 20,
              marginBottom: 0,
              background:
                "linear-gradient(107deg, rgba(255, 255, 255, 0.70) 44.17%, rgba(255, 255, 255, 0.40) 100%)",
            }}
          >
            <form onSubmit={onSumbitCsv}>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      Upload CSV File<span style={{ color: "red" }}>*</span>
                    </div>
                    <ImageUploader
                      message=" "
                      accept=".csv"
                      maxCount={1}
                      onChange={(e) => {
                        handleSelect(e, "csv");
                      }}
                      value={files.csv}
                    />
                  </div>
                  {moduleData === "PRODUCTS" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div>Upload Zip File (Optional)</div>
                      <ImageUploader
                        message=" "
                        maxCount={1}
                        accept=".zip"
                        onChange={(e) => {
                          handleSelect(e, "zip");
                        }}
                        value={files.zip}
                      />
                    </div>
                  )}
                  <button
                    className={
                      !!files.csv.length
                        ? "button_primary"
                        : "button_primary_disabled"
                    }
                    type="submit"
                    style={{ width: "120px", padding: 4, marginTop: 4 }}
                    disabled={!files.csv.length}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                height: 0,
                alignItems: "center",
                justifyContent: "center",
                margin: 24,
              }}
            >
              <h4 style={{ fontWeight: "500" }}>Sample File : &nbsp; </h4>
              <a
                href={`https://prod-rupyz-data.rupyz.com/static/documents/pub/bulk-upload-csv/${linkConstant[moduleData]}.csv`}
                style={{ color: "blue", fontWeight: "600" }}
                download="file.pdf"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default BulkUploadingCSV;

const linkConstant = {
  PRODUCTS: "product_sample",
  STAFF: "staff_sample",
  CUSTOMER: "customer_sample",
  "ASSIGN-STAFF-CUSTOMERS": "staff_customer_mapping",
  "ASSIGN-BEAT-CUSTOMERS": "beat_customer_assign",
};
const titleConstant = {
  PRODUCTS: "Products",
  STAFF: "Staff",
  CUSTOMER: "Customer",
  "ASSIGN-STAFF-CUSTOMERS": "Customer in Staff",
  "ASSIGN-BEAT-CUSTOMERS": "Beat in Customer",
};
