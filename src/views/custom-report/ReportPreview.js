import "./custom-report.css";
import { Col, Drawer } from "antd";
import { getFieldsLabelName } from ".";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import domTemplates from "./domTemplates";
import { profileAction } from "../../redux/action/profileAction";

export const instructionRegex = /{%\s*(if|else|endif|for|endfor)\s*[^%]*%\}/g;

export default function ReportPreview({
  isPreview,
  setIsPreview,
  data,
  template,
}) {
  const dispatch = useDispatch();
  const [organizationDetails, setOrganizationDetails] = useState({});

  const state = useSelector((state) => state);
  const { profile } = state;

  useEffect(() => {
    if (profile.data && !profile.data.data.error) {
      setOrganizationDetails(profile.data.data.data);
    }
  }, [profile]);

  useEffect(() => {
    dispatch(profileAction());
  }, []);

  const fillersMockData = {
    logo_image: organizationDetails?.logo_image_url,
    seller_name: organizationDetails?.legal_name,
    seller_address_line_1: organizationDetails?.address_line_1,
    seller_city: organizationDetails?.city,
    seller_state: organizationDetails?.state,
    seller_pincode: organizationDetails?.pincode,
    seller_gstin: organizationDetails?.primary_gstin,
    seller_email: organizationDetails?.email,
    seller_mobile: organizationDetails?.mobile,
    order_no: "123",
    payment_terms: "Your payment terms",
    order_date: "Order Date",
    user_name: "Order By Name",
    buyer_name: "Buyer Name",
    buyer_address_line_1: "Buyer Address",
    buyer_city: "city",
    buyer_state: "state",
    buyer_pincode: "Pincode",
    buyer_mobile_no: "XXXXX-XXXXX",
    buyer_email_id: "example@gmail.com",
    buyer_gstin: "AA123123AA123",
    delivery_location_name: "Delivery Location",
    delivery_location_address_line_1: "Address",
    delivery_location_city: "City",
    delivery_location_state: "State",
    delivery_location_pincode: "Pincode",
    delivery_location_mobile: "XXXXX-XXXXX",
    dispatch_no: "Dispatch No.",
    dispatch_date: "Date",
    lr_no: "123",
    transporter_name: "John Doe",
    driver_name: "John Doe",
    vehicle_number: "12 21 1234",
    freight_amount: "123",
    payment_information: "Payment Information",
    invoice_number: "IN123",
    transporter_mobile_number: "XXXXX-XXXXX",
    driver_mobile_number: "XXXXX-XXXXX",
    broker_information: "John Doe",
    "s3_data.file_name": "Attachment 1",
    "forloop.counter": 1,
    "item.display_pic": require("../../assets/no-photo-available.gif"),
    "item.code": "CODE",
    "item.name": "Product Name",
    "item.gst": "0",
    "item.description": "description",
    "item.quantity": 1,
    "item.packaging_unit": "unit",
    "item.packaging_size": "size",
    "item.unit": "unit",
    "item.base_price": 100,
    "item.discount_value": "0",
    "item.net_rate": 100,
    "item.total_price_without_gst": 100,
    "item.total_gst_amount": "0",
    "item.total_price": 100,
    "bank_detail.name":
      organizationDetails?.bank_detail?.name || "XXXX XXX XXXX",
    "bank_detail.address":
      organizationDetails?.bank_detail?.address || "XXXX XXX XXXX",
    "bank_detail.account_number":
      organizationDetails?.bank_detail?.account_number || "XXXXXXXXXXXXXXXX",
    "bank_detail.ifsc_code":
      organizationDetails?.bank_detail?.ifsc_code || "XXXXXXXXXXX",
    "bank_detail.qr_code_url":
      organizationDetails?.bank_detail?.qr_code_url ||
      require("../../assets/no-photo-available.gif"),
    gross_amount: 100,
    taxable_amount: "0",
    sgst: "0",
    cgst: "0",
    igst: "0",
    sub_total_amount: 100,
    "discount_detail.name": "Discount 1",
    "discount_detail.value": "0",
    "discount_detail.calculated_value": "0",
    "charge_detail.name": "Charge 1",
    "charge_detail.value": 40,
    "total_qty.name": "Box",
    "total_qty.value": "10",
    discount_amount: "0",
    other_charges: 40,
    total_amount: 140,
    comment: "Your comments will display here.",
    ...getFieldsLabelName(data),
  };

  return (
    <Drawer
      open={isPreview}
      onClose={() => setIsPreview(false)}
      title={<div style={{ textAlign: "center" }}>Preview</div>}
      width={700}
    >
      <Col style={styles.pdf_container} className="custom-report-layout">
        <div
          dangerouslySetInnerHTML={{
            __html: formatTemplate(
              new domTemplates.Template({
                element: "div",
                children: template,
              }).render(fillersMockData)
            ),
          }}
        />
      </Col>
    </Drawer>
  );
}

const formatTemplate = (data) => {
  return data?.replace(instructionRegex, "");
};

const styles = {
  pdf_container: {
    transform: "scale(0.95)",
    position: "relative",
    backgroundColor: "#fff",
    width: 595,
    margin: "auto",
    height: 842,
    padding: "10px 10px",
    overflow: "scroll",
  },
};
