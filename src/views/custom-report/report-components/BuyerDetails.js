import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template(
  {
    element: "td",
    children: [
      new Template(
        {
          element: "h4",
          props: {
            theme: true,
            bold: true,
          },
          children: [new Label()],
        },
        "buyer_details"
      ),
      new Template(
        {
          element: "h4",
          props: {
            bold: true,
          },
          children: [new Filler("buyer_name")],
        },
        "buyer_details_name"
      ),
      new Template(
        {
          element: "h4",
          children: [
            new Filler("buyer_address_line_1"),
            ", ",
            new Filler("buyer_city"),
          ],
        },
        "buyer_details_address"
      ),
      new Template(
        {
          element: "h4",
          children: [
            new Filler("buyer_state"),
            " - ",
            new Filler("buyer_pincode"),
          ],
        },
        "buyer_details_address"
      ),
      new Template(
        {
          element: "h4",
          children: [new Label(), " ", new Filler("buyer_mobile_no")],
        },
        "buyer_details_mobile"
      ),
      new Template(
        {
          element: "h4",
          children: [new Label(), " ", new Filler("buyer_email_id")],
        },
        "buyer_details_email"
      ),
      new Template(
        {
          element: "h4",
          children: [new Label(), " ", new Filler("buyer_gstin")],
        },
        "buyer_details_gst"
      ),
    ],
  },
  "buyer_details"
);
