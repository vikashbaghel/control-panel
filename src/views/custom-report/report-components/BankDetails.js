import domTemplates from "../domTemplates";

const { Template, Label, Filler } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template({
  element: "td",
  style: {
    "vertical-align": "top",
  },
  children: [
    new Template(
      {
        element: "p",
        children: [
          new Template(
            {
              element: "span",
              props: {
                blur: true,
              },
              children: [new Label(), " : "],
            },
            "bank_name"
          ),
          new Template({
            element: "span",
            style: { float: "right" },
            props: {
              bold: true,
            },
            children: [new Filler("bank_detail.name")],
          }),
        ],
      },
      "bank_name"
    ),
    new Template(
      {
        element: "p",
        children: [
          new Template(
            {
              element: "span",
              props: {
                blur: true,
              },
              children: [new Label(), " : "],
            },
            "bank_address"
          ),
          new Template({
            element: "span",
            props: {
              bold: true,
            },
            style: { float: "right" },
            children: [new Filler("bank_detail.address")],
          }),
        ],
      },
      "bank_address"
    ),
    new Template(
      {
        element: "p",
        children: [
          new Template(
            {
              element: "span",
              props: {
                blur: true,
              },
              children: [new Label(), " : "],
            },
            "bank_Account_no"
          ),
          new Template({
            element: "span",
            props: {
              bold: true,
            },
            style: { float: "right" },
            children: [new Filler("bank_detail.account_number")],
          }),
        ],
      },
      "bank_Account_no"
    ),
    new Template(
      {
        element: "p",
        children: [
          new Template(
            {
              element: "span",
              props: {
                blur: true,
              },
              children: [new Label(), " :"],
            },
            "bank_ifsc_code"
          ),
          new Template({
            element: "span",
            props: {
              bold: true,
            },
            style: { float: "right" },
            children: [new Filler("bank_detail.ifsc_code")],
          }),
        ],
      },
      "bank_ifsc_code"
    ),
    new Template(
      {
        element: "p",
        props: {
          blur: true,
        },
        children: [new Label()],
      },
      "bank_qr_code"
    ),
    new Template(
      {
        element: "img",
        props: {
          src: new Filler("bank_detail.qr_code_url"),
          alt: "qr-code",
        },
        style: {
          width: "100px",
          height: "100px",
        },
      },
      "bank_qr_code"
    ),
  ],
});
