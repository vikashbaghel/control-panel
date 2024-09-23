import { DownloadOutlined, PrinterFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  notification,
  Progress,
  Row,
  Select,
  Space,
} from "antd";
import QRCode from "react-qr-code";
import { usePDF, Margin } from "react-to-pdf";
import { fetchProducts } from "../../redux/action/productAction";
import moment from "moment";
import { useEffect, useState } from "react";
import { fetchOverview } from "../../redux/action/dashboardAction";
import thread from "../../services/thread";
import WrapText from "../../components/wrapText";

const constants = {
  A4_RATIO: 1.414141,
  qrPerPage: {
    options: [
      { rows: 2, columns: 2 },
      { rows: 3, columns: 3 },
      { rows: 4, columns: 4 },
    ],
    defaultValue: 2,
  },
  pageStyle: {
    width: 840,
    backgroundColor: "#fff",
    marginTop: 400,
    paddingBottom: 200,
  },
  qrContainerStyle: {
    padding: 16,
  },
  bulkQR: {
    batchLength: 120,
    defaultBatchDetails: {
      total: 0,
      n: 0,
      rangeStart: 0,
      rangeEnd: 0,
    },
  },
};

const states = {
  bulkQR: {
    active: true,
    qrPerPage: constants.qrPerPage["defaultValue"],
  },
};

export function filterQRData(data = []) {
  return (data || []).map(({ code, name, variant_name }) => ({
    code,
    name: name.length > 40 ? name.slice(0, 40) + "..." : name,
    variant_name,
  }));
}

export const ProductBulkQR = ({ bulkQR, setBulkQR, selectedProducts }) => {
  const { toPDF, targetRef } = usePDF();
  const [printCanvas, setPrintCanvas] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [batch, setBatch] = useState({
    ...constants.bulkQR.defaultBatchDetails,
  });
  const [loader, setLoader] = useState(false);

  function reset() {
    setPrintCanvas("");
    setProductCount(0);
    setTotalCount(0);
    setBatch({
      ...constants.bulkQR.defaultBatchDetails,
    });
  }

  async function setPDFTemplate(activeProductList) {
    let pageX = constants.pageStyle.width;
    let pageY = pageX * constants["A4_RATIO"];
    let { rows, columns } =
      constants.qrPerPage["options"][states.bulkQR["qrPerPage"]];
    setPrintCanvas([
      ...activeProductList.map((product, index) => (
        <div
          key={index}
          style={{
            height: pageY / rows,
            width: pageX / columns,
          }}
        >
          <Col
            style={{
              border: "1px dashed #DDDDDD",
            }}
          >
            <QRTemplate
              {...{ product }}
              height={pageY / rows - 2}
              width={pageX / columns - 2}
            />
          </Col>
        </div>
      )),
    ]);
  }

  async function generatePDF(
    filename = `QR Batch ${moment().format("DD-MM-YY")}.pdf`,
    message = `QR codes downloaded`
  ) {
    setLoader(true);
    await thread.onIdle();
    let result = await toPDF({ filename });
    await thread.onIdle();
    notification.success({
      message,
    });
    setLoader(false);
  }

  async function downloadBulkQR(selectedProducts = []) {
    if (selectedProducts.length) {
      setTotalCount(selectedProducts.length);
      setProductCount(selectedProducts.length);
      setPDFTemplate([...filterQRData(selectedProducts)]);
      await generatePDF();
    } else {
      let batches = 0;
      let total_products = 0;
      let { data } = (await fetchOverview()) || {};
      if (data) {
        let { products } = data["data"] || { products: 0 };
        total_products = products;
        if (products > constants.bulkQR.batchLength) {
          batches = Math.ceil(products / constants.bulkQR.batchLength);
        }
      }
      setTotalCount(total_products);
      let page_no = 1;
      let product_count = 0;
      let activebatch = { ...constants.bulkQR.defaultBatchDetails };
      let activeProductList = [];
      while (states.bulkQR.active) {
        let { data } = (await fetchProducts({ page_no })) || {};
        if (data && states.bulkQR.active) {
          activeProductList = [...activeProductList, ...filterQRData(data)];
          product_count = product_count + data.length;
          let n = Math.ceil(product_count / constants.bulkQR.batchLength);
          //check if current batch is completed
          if (n > activebatch.n) {
            const lastBatchDetails = { ...activebatch };
            if (product_count >= constants.bulkQR.batchLength) {
              setPDFTemplate([...filterQRData(activeProductList)]);
              await generatePDF(
                `QR Batch ${lastBatchDetails.rangeStart}-${lastBatchDetails.rangeEnd}`,
                `Batch ${lastBatchDetails.n} downloaded`
              );
              activeProductList = [];
            }
            let rangeEnd = n * constants.bulkQR.batchLength;
            activebatch = {
              n,
              total: batches,
              rangeStart: (n - 1) * constants.bulkQR.batchLength + 1,
              rangeEnd: rangeEnd > total_products ? total_products : rangeEnd,
            };
            activebatch.batchLength =
              activebatch.rangeEnd - activebatch.rangeStart + 1;
            setBatch({ ...activebatch });
          } else if (
            data.length < 30 ||
            (product_count === total_products &&
              product_count === activebatch.rangeEnd)
          ) {
            if (activeProductList.length) {
              setPDFTemplate([...filterQRData(activeProductList)]);
              await generatePDF(
                `QR Batch ${activebatch.rangeStart}-${activebatch.rangeEnd}`
              );
            }
            break;
          }
          setProductCount(product_count);
          page_no += 1;
        } else {
          break;
        }
      }
    }
    setBulkQR(false);
  }

  useEffect(() => {
    states.bulkQR.active = !!bulkQR;
    reset();
    if (bulkQR) {
      downloadBulkQR(selectedProducts);
    }
  }, [bulkQR, selectedProducts]);

  return (
    <>
      {printCanvas && (
        <Col align="middle">
          <Row ref={targetRef} style={constants.pageStyle}>
            {printCanvas}
          </Row>
        </Col>
      )}
      <Modal
        title={<div style={{ textAlign: "center" }}>Generating QR Codes</div>}
        width={440}
        open={!!bulkQR}
        className="modal-layout"
        closeIcon={false}
        footer={[
          <Button
            style={loader ? { opacity: 0.5 } : {}}
            onClick={() => {
              setBulkQR(false);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "calc(100% - 12px)" }}
        >
          <Col>
            {productCount}
            {!!totalCount && `/${totalCount}`} Products
            <Progress
              percent={
                totalCount ? ((productCount / totalCount) * 100).toFixed() : 0
              }
              status="normal"
            />
          </Col>
          {!!batch.n && (
            <Col>
              <Space>
                <div>
                  Batch {batch.n}/{batch.total}
                </div>
                <div style={{ color: "#9C9C9C" }}>
                  (Products {batch.rangeStart}-{batch.rangeEnd})
                </div>
              </Space>
              <Progress
                strokeColor={"#7C7C7C"}
                {...(productCount < batch.rangeEnd
                  ? {
                      percent:
                        ((productCount - batch.rangeStart) /
                          batch.batchLength) *
                        100,
                      format: () => {
                        return `${productCount - batch.rangeStart}/${
                          batch.batchLength
                        }`;
                      },
                    }
                  : {
                      percent: 100,
                      format: () => `${batch.batchLength}/${batch.batchLength}`,
                    })}
              />
            </Col>
          )}
        </Space>
      </Modal>
    </>
  );
};

const ProductQR = ({ product, onCancel }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `${product.code || "sample"}.pdf`,
    page: {
      margin: Margin.MEDIUM,
    },
  });

  return (
    <Modal
      width={440}
      open={!!product.code}
      className="modal-layout"
      {...{ onCancel }}
      title={<div style={{ textAlign: "center" }}>QR Code</div>}
      footer={null}
    >
      <Col align="middle">
        <Space ref={targetRef}>
          <QRTemplate {...{ product }} />
        </Space>
        <Space>
          <Button
            onClick={() => {
              toPDF();
              notification.success({
                message: "QR downloaded",
              });
            }}
          >
            <div style={styles.btn_content} align="middle">
              <DownloadOutlined style={styles.btn_icon} /> Download QR Code
            </div>
          </Button>
          <Button
            onClick={() => {
              var frame = window.frames["qr-canvas"];
              frame.document.write(
                `<body onload="window.print()">${targetRef.current.innerHTML}</body>`
              );
              frame.document.close();
            }}
          >
            <div style={styles.btn_content} align="middle">
              <PrinterFilled style={styles.btn_icon} /> Print QR Code
            </div>
          </Button>
        </Space>
        <div style={{ display: "none" }}>
          <iframe id="qr-canvas" name="qr-canvas" />
        </div>
      </Col>
    </Modal>
  );
};

export const QRTemplate = ({ product, height = 400, width = 300 }) => {
  let qrSize = width - constants.qrContainerStyle.padding * 2;
  return (
    <div style={{ height, width }}>
      {product.code && (
        <Col style={constants.qrContainerStyle}>
          <QRCode value={`${product.code}`} size={qrSize} bgColor="#FFFFFF00" />
          <Col
            align="start"
            style={{
              padding: "10px 0px",
              width: qrSize,
            }}
          >
            <div style={{ color: "#727176" }}>{product.code}</div>
            <div style={{ color: "#312B81" }}>
              <WrapText width={qrSize}>
                {product.name.replace(product.variant_name || "", "")}
              </WrapText>
            </div>
            <div style={{ color: "#727176" }}>
              <WrapText width={qrSize}>{product.variant_name || ""}</WrapText>
            </div>
          </Col>
        </Col>
      )}
    </div>
  );
};

export const QRHeader = ({ bulkQR, setBulkQR }) => {
  const [selection, setSelection] = useState(states.bulkQR["qrPerPage"]);

  const headerStyles = {
    selectSize: 240,
    gutter: 16,
  };

  useEffect(() => {
    states.bulkQR["qrPerPage"] = selection;
  }, [selection]);

  return (
    <Col>
      <Select
        style={{
          width: headerStyles.selectSize,
          position: "absolute",
          left: -1 * (headerStyles.selectSize + headerStyles.gutter),
        }}
        options={[
          ...constants.qrPerPage.options.map((option, index) => ({
            label: `${option.rows} X ${option.columns}`,
            value: index,
          })),
        ]}
        labelRender={(selection) => {
          return `QR code per page : ${selection.label}`;
        }}
        value={selection}
        onChange={setSelection}
      />
      <Button
        style={{ height: 45 }}
        onClick={() => {
          setBulkQR(true);
        }}
      >
        <Space align="center">
          <Col style={{ height: 18 }}>
            <DownloadOutlined style={{ fontSize: 18 }} />
          </Col>
          <div>Download QR</div>
        </Space>
      </Button>
    </Col>
  );
};

const styles = {
  btn_content: {
    width: 140,
    fontSize: 12,
    color: "#727176",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 4,
  },
  btn_icon: {
    fontSize: 20,
  },
};

export default ProductQR;
