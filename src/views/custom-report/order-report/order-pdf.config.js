export const orderPdfConfig = [
  {
    name: "org_details",
    sections: [
      {
        title: "",
        key: "pdf_header",
        status: "required",
        editable: false,
        fields: {
          order_estimate: {
            status: "visible",
            name: "Order Estimate",
            editable: true,
          },
          logo: {
            status: "visible",
            name: "Logo",
            editable: false,
          },
          name: {
            status: "visible",
            name: "Order Recipient Organization Name",
            editable: false,
          },
          gst: {
            status: "visible",
            name: "GST",
            editable: true,
          },
          email: {
            status: "visible",
            name: "E-mail",
            editable: true,
          },
          mobile: {
            status: "visible",
            name: "Mobile No.",
            editable: true,
          },
        },
      },
      {
        title: "",
        key: "order_details",
        status: "visible",
        editable: false,
        fields: {
          order_details_order_no: {
            status: "visible",
            name: "Order No.",
            editable: true,
          },
          order_details_payment_terms: {
            status: "visible",
            name: "Payment Terms",
            editable: true,
          },
          order_details_order_date: {
            status: "visible",
            name: "Order Date",
            editable: true,
          },
          order_details_staff_name: {
            status: "visible",
            name: "Order Taken By",
            editable: true,
          },
        },
      },
      {
        title: "Buyer (Bill to)",
        key: "buyer_details",
        status: "visible",
        editable: true,
        fields: {
          buyer_details_name: {
            status: "visible",
            name: "Name",
            editable: true,
          },
          buyer_details_address: {
            status: "visible",
            name: "Address",
            editable: true,
          },
          buyer_details_mobile: {
            status: "visible",
            name: "Mobile No.",
            editable: true,
          },
          buyer_details_email: {
            status: "visible",
            name: "E-mail",
            editable: true,
          },
          buyer_details_gst: {
            status: "visible",
            name: "GST",
            editable: true,
          },
        },
      },
      {
        title: "Delivery Location (Ship to)",
        key: "delivery_details",
        status: "visible",
        editable: true,
        fields: {
          delivery_details_name: {
            status: "visible",
            name: "Name",
            editable: true,
          },
          delivery_details_address: {
            status: "visible",
            name: "Address",
            editable: true,
          },
        },
      },
    ],
  },
  {
    name: "order_details",
    sections: [
      {
        title: "",
        key: "product_details",
        status: "required",
        editable: false,
        fields: {
          product_details_s_no: {
            status: "visible",
            name: "S. No.",
            editable: true,
          },
          product_picture_details: {
            status: "visible",
            name: "Picture",
            editable: false,
          },
          product_code: {
            status: "visible",
            name: "Product Code",
            editable: false,
          },
          product_name: {
            status: "visible",
            name: "Product Name",
            editable: false,
          },
          product_gst: {
            status: "visible",
            name: "GST",
            editable: true,
          },
          product_desc_details: {
            status: "visible",
            name: "Description of Goods / Service",
            editable: true,
          },
          product_qty_details: {
            status: "visible",
            name: "Quantity",
            editable: true,
          },
          product_rate_details: {
            status: "visible",
            name: "Rate Rs (Excl. GST)",
            editable: true,
          },
          product_discount: {
            status: "visible",
            name: "Discount",
            editable: true,
          },
          product_net_rate: {
            status: "visible",
            name: "Net Rate",
            editable: true,
          },
          product_netamount_details: {
            status: "visible",
            name: "Net Amount (Rs)",
            editable: true,
          },
          product_gst_amount_details: {
            status: "visible",
            name: "GST Amount (Rs)",
            editable: true,
          },
          product_total_amount_details: {
            status: "visible",
            name: "Total Amount (Rs)",
            editable: true,
          },
        },
      },
    ],
  },
  {
    name: "bank_details",
    sections: [
      {
        title: "Bank Info",
        key: "bank_info",
        status: "required",
        editable: false,
        fields: {
          bank_name: {
            status: "visible",
            name: "Bank Name",
            editable: true,
          },
          bank_address: {
            status: "visible",
            name: "Bank Address",
            editable: true,
          },
          bank_Account_no: {
            status: "visible",
            name: "Account No.",
            editable: true,
          },
          bank_ifsc_code: {
            status: "visible",
            name: "IFSC Code",
            editable: true,
          },
          bank_qr_code: {
            status: "visible",
            name: "Qr Code",
            editable: true,
          },
        },
      },
      {
        title: "Total Amount",
        key: "order_amount_details",
        status: "required",
        editable: false,
        fields: {
          order_amount_discounts: {
            status: "visible",
            name: "Discounts",
            editable: true,
          },
          order_amount_other_charges: {
            status: "visible",
            name: "Other Charges",
            editable: true,
          },
          order_amount_taxable_value: {
            status: "visible",
            name: "Taxable Value",
            editable: true,
          },
          order_amount_sgst: {
            status: "visible",
            name: "SGST/UTGST",
            editable: true,
          },
          order_amount_cgst: {
            status: "visible",
            name: "CGST",
            editable: true,
          },
          order_amount_igst: {
            status: "visible",
            name: "IGST",
            editable: true,
          },
          order_amount_sub_total: {
            status: "visible",
            name: "Sub Total",
            editable: true,
          },
          order_amount_total_discount: {
            status: "visible",
            name: "Total Discount",
            editable: true,
          },
          order_amount_total_other_charges: {
            status: "visible",
            name: "Total Other Charges",
            editable: true,
          },
          order_amount_total_amount: {
            status: "visible",
            name: "Total Amount",
            editable: true,
          },
        },
      },
      {
        title: "",
        key: "total_qty_details",
        status: "required",
        editable: false,
        fields: {
          total_qty_details_label: {
            status: "visible",
            name: "Total Quantity",
            editable: true,
          },
        },
      },
    ],
  },
  {
    name: "terms",
    sections: [
      {
        title: "Terms & Conditions",
        key: "terms_section",
        status: "hidden",
        editable: true,
        fields: {
          terms: {
            metadata: [],
          },
        },
      },
      {
        title: "Notes/Comments",
        key: "comments",
        status: "visible",
        editable: true,
        fields: {},
      },
    ],
  },
];
