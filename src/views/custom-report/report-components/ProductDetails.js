import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template({
  element: "table",
  props: {
    class: "product-list table-layout mt",
  },
  children: [
    new Template({
      element: "tr",
      children: [
        new Template(
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
                "product_details_s_no"
              ),
            ],
          },
          "product_details_s_no"
        ),
        new Template(
          {
            element: "td",
            props: {
              align: "center",
            },
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
                "product_picture_details"
              ),
            ],
          },
          "product_picture_details"
        ),
        new Template(
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
                "product_desc_details"
              ),
            ],
          },
          "product_desc_details"
        ),
        new Template(
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
                "product_qty_details"
              ),
            ],
          },
          "product_qty_details"
        ),
        new Template(
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
                "product_rate_details"
              ),
            ],
          },
          "product_rate_details"
        ),
        new Template(
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
                "product_netamount_details"
              ),
            ],
          },
          "product_netamount_details"
        ),
        new Template(
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
                "product_gst_amount_details"
              ),
            ],
          },
          "product_gst_amount_details"
        ),
        new Template(
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
                "product_total_amount_details"
              ),
            ],
          },
          "product_total_amount_details"
        ),
      ],
    }),
    "{% for item in product_items %}",
    new Template({
      element: "tr",
      children: [
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "h4",
                props: {
                  align: "center",
                },
                children: [new Filler("forloop.counter")],
              }),
            ],
          },
          "product_details_s_no"
        ),
        new Template(
          {
            element: "td",
            children: [
              "{% if item.display_pic %}",
              new Template({
                element: "img",
                props: {
                  src: new Filler("item.display_pic"),
                  class: "product-image",
                },
              }),
              "{% else %}",
              new Template({
                element: "img",
                props: {
                  src: new Filler("product_default_image"),
                  class: "product-image",
                },
              }),
              "{% endif %}",
            ],
          },
          "product_picture_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template(
                {
                  element: "h5",
                  props: {
                    blur: true,
                  },
                  children: [new Filler("item.code")],
                },
                "product_code"
              ),
              new Template(
                {
                  element: "h4",
                  children: [new Filler("item.name")],
                },
                "product_name"
              ),
              new Template(
                {
                  element: "h4",
                  props: {
                    blur: true,
                  },
                  children: [new Label(), " : ", new Filler("item.gst"), "%"],
                },
                "product_gst"
              ),

              "{% if item.description %}",
              new Template({
                element: "h5",
                props: {
                  blur: true,
                },
                children: [new Filler("item.description")],
              }),
              "{% endif %}",
            ],
          },
          "product_desc_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "h4",
                props: {
                  bold: true,
                },
                children: [
                  new Filler("item.quantity"),
                  " X ",
                  new Filler("item.packaging_unit"),
                ],
              }),
              new Template({
                element: "h4",
                props: {
                  blur: true,
                },
                children: [
                  new Filler("item.quantity"),
                  " X ",
                  new Filler("item.packaging_size"),
                  " ",
                  new Filler("item.unit"),
                ],
              }),
            ],
          },
          "product_qty_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "table",
                props: {
                  class: "descriptions",
                  bordered: "false",
                },
                children: [
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
                            children: [new Filler("item.unit"), " :"],
                          }),
                        ],
                      }),
                      new Template({
                        element: "td",
                        children: [
                          new Template({
                            element: "h4",
                            props: {
                              align: "right",
                            },
                            children: [new Filler("item.base_price")],
                          }),
                        ],
                      }),
                    ],
                  }),
                  "{% if item.discount_value %}",
                  new Template(
                    {
                      element: "tr",
                      children: [
                        new Template({
                          element: "td",
                          children: [
                            new Template(
                              {
                                element: "h4",
                                props: {
                                  blur: true,
                                },
                                children: [new Label(), ": "],
                              },
                              "product_discount"
                            ),
                          ],
                        }),
                        new Template({
                          element: "td",
                          children: [
                            new Template({
                              element: "h4",
                              props: {
                                align: "right",
                              },
                              children: [new Filler("item.discount_value")],
                            }),
                          ],
                        }),
                      ],
                    },
                    "product_discount"
                  ),
                  new Template(
                    {
                      element: "tr",
                      children: [
                        new Template({
                          element: "td",
                          children: [
                            new Template(
                              {
                                element: "h4",
                                props: {
                                  blur: true,
                                },
                                children: [new Label(), ": "],
                              },
                              "product_net_rate"
                            ),
                          ],
                        }),
                        new Template({
                          element: "td",
                          children: [
                            new Template({
                              element: "h4",
                              props: {
                                align: "right",
                              },
                              children: [new Filler("item.net_rate")],
                            }),
                          ],
                        }),
                      ],
                    },
                    "product_net_rate"
                  ),
                  "{% endif %}",
                ],
              }),
            ],
          },
          "product_rate_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "h4",
                props: {
                  align: "right",
                },
                children: [new Filler("item.total_price_without_gst")],
              }),
            ],
          },
          "product_netamount_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "h4",
                props: {
                  align: "right",
                },
                children: [new Filler("item.total_gst_amount")],
              }),
            ],
          },
          "product_gst_amount_details"
        ),
        new Template(
          {
            element: "td",
            children: [
              new Template({
                element: "h4",
                props: {
                  align: "right",
                },
                children: [new Filler("item.total_price")],
              }),
            ],
          },
          "product_total_amount_details"
        ),
      ],
    }),
    "{% endfor %}",
  ],
});
