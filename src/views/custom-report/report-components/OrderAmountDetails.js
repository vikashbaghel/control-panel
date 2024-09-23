import domTemplates from "../domTemplates";
import BankDetails from "./BankDetails";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template({
  element: "table",
  props: {
    class: "table-layout mt",
  },
  children: [
    new Template({
      element: "tr",
      style: {
        "line-height": "2",
      },
      children: [
        BankDetails,
        new Template({
          element: "td",
          style: {
            "vertical-align": "top",
          },
          children: [
            new Template({
              element: "p",
              props: {
                bold: true,
              },
              children: [
                new Template({
                  element: "span",
                  children: ["Gross Amount : "],
                }),
                new Template({
                  element: "span",
                  style: {
                    float: "right",
                  },
                  children: [new Filler("gross_amount")],
                }),
              ],
            }),
            "{% if discount_details %}",
            new Template({
              element: "p",
              style: {
                margin: "5px 0",
              },
              props: {
                class: "dashed-border",
              },
            }),
            new Template(
              {
                element: "p",
                props: {
                  blur: true,
                },
                children: [new Label()],
              },
              "order_amount_discounts"
            ),
            new Template(
              {
                element: "p",
                children: [
                  new Template({
                    element: "table",
                    props: {
                      class: "table-layout",
                      bordered: "false",
                    },
                    children: [
                      "{% for discount_detail in discount_details %}",
                      new Template({
                        element: "tr",
                        children: [
                          new Template({
                            element: "td",
                            children: [
                              new Template({
                                element: "h4",
                                props: {
                                  blur: true,
                                },
                                children: [
                                  new Filler("forloop.counter"),
                                  ". ",
                                  new Filler("discount_detail.name"),
                                  " ",
                                  `{% if discount_detail.type == "PERCENT" %}`,
                                  " ",
                                  "(",
                                  new Filler("discount_detail.value"),
                                  "%)",
                                  "{% endif %}",
                                ],
                              }),
                            ],
                          }),
                          new Template({
                            element: "td",
                            children: [
                              new Template({
                                element: "h4",
                                props: {
                                  blur: true,
                                  align: "right",
                                },
                                children: [
                                  new Filler(
                                    "discount_detail.calculated_value"
                                  ),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      "{% endfor %}",
                    ],
                  }),
                ],
              },
              "order_amount_discounts"
            ),

            new Template(
              {
                element: "p",
                props: {
                  bold: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " : "],
                    },
                    "order_amount_total_discount"
                  ),
                  new Template({
                    element: "span",
                    style: {
                      float: "right",
                    },
                    children: [new Filler("discount_amount")],
                  }),
                ],
              },
              "order_amount_total_discount"
            ),
            new Template({
              element: "p",
              style: {
                margin: "5px 0",
              },
              props: {
                class: "dashed-border",
              },
            }),
            "{% endif %}",
            new Template(
              {
                element: "p",
                props: {
                  bold: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " :"],
                    },
                    "order_amount_taxable_value"
                  ),
                  new Template({
                    element: "span",
                    style: {
                      float: "right",
                    },
                    children: [new Filler("taxable_amount")],
                  }),
                ],
              },
              "order_amount_taxable_value"
            ),
            new Template(
              {
                element: "p",
                props: {
                  blur: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " :"],
                    },
                    "order_amount_sgst"
                  ),
                  new Template({
                    element: "span",
                    style: { float: "right" },
                    children: [new Filler("sgst")],
                  }),
                ],
              },
              "order_amount_sgst"
            ),
            new Template(
              {
                element: "p",
                props: {
                  blur: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " :"],
                    },
                    "order_amount_cgst"
                  ),
                  new Template({
                    element: "span",
                    style: { float: "right" },
                    children: [new Filler("cgst")],
                  }),
                ],
              },
              "order_amount_cgst"
            ),
            new Template(
              {
                element: "p",
                props: {
                  blur: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " :"],
                    },
                    "order_amount_igst"
                  ),
                  new Template({
                    element: "span",
                    style: { float: "right" },
                    children: [new Filler("igst")],
                  }),
                ],
              },
              "order_amount_igst"
            ),
            new Template(
              {
                element: "p",
                props: {
                  bold: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " :"],
                    },
                    "order_amount_sub_total"
                  ),
                  new Template({
                    element: "span",
                    style: { float: "right" },
                    children: [new Filler("sub_total_amount")],
                  }),
                ],
              },
              "order_amount_sub_total"
            ),
            "{% if charges_details %}",
            new Template({
              element: "p",
              style: {
                margin: "5px 0",
              },
              props: {
                class: "dashed-border",
              },
            }),
            new Template(
              {
                element: "p",
                props: {
                  blur: true,
                },
                children: [new Label()],
              },
              "order_amount_other_charges"
            ),

            new Template(
              {
                element: "p",
                children: [
                  new Template({
                    element: "table",
                    props: {
                      class: "table-layout",
                      bordered: "false",
                    },
                    children: [
                      "{% for charge_detail in charges_details %}",
                      new Template({
                        element: "tr",
                        children: [
                          new Template({
                            element: "td",
                            children: [
                              new Template({
                                element: "h4",
                                props: {
                                  blur: true,
                                },
                                children: [
                                  new Filler("forloop.counter"),
                                  ". ",
                                  new Filler("charge_detail.name"),
                                ],
                              }),
                            ],
                          }),
                          new Template({
                            element: "td",
                            children: [
                              new Template({
                                element: "h4",
                                props: {
                                  blur: true,
                                  align: "right",
                                },
                                children: [new Filler("charge_detail.value")],
                              }),
                            ],
                          }),
                        ],
                      }),
                      "{% endfor %}",
                    ],
                  }),
                ],
              },
              "order_amount_other_charges"
            ),
            new Template(
              {
                element: "p",
                props: {
                  bold: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " : "],
                    },
                    "order_amount_total_other_charges"
                  ),
                  new Template({
                    element: "span",
                    style: { float: "right" },
                    children: [new Filler("other_charges")],
                  }),
                ],
              },
              "order_amount_total_other_charges"
            ),
            new Template({
              element: "p",
              style: {
                margin: "5px 0",
              },
              props: {
                class: "dashed-border",
              },
            }),
            "{% endif %}",
            new Template(
              {
                element: "p",
                props: {
                  bold: true,
                },
                children: [
                  new Template(
                    {
                      element: "span",
                      children: [new Label(), " : "],
                    },
                    "order_amount_total_amount"
                  ),
                  new Template({
                    element: "span",
                    style: {
                      float: "right",
                    },
                    children: [new Filler("total_amount")],
                  }),
                ],
              },
              "order_amount_total_amount"
            ),
          ],
        }),
      ],
    }),
  ],
});
