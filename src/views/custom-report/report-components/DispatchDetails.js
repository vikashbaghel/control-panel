import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template(
  {
    element: "table",
    props: {
      class: "table-layout",
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
                    children: [new Label(), " ", new Filler("dispatch_no")],
                  },
                  "dispatch_details_dispatch_no"
                ),
              ],
            },
            "dispatch_details_dispatch_no"
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
                      align: "right",
                    },
                    children: [new Label(), " : ", new Filler("dispatch_date")],
                  },
                  "dispatch_details_dispatch_date"
                ),
              ],
            },
            "dispatch_details_dispatch_date"
          ),
        ],
      }),
      new Template({
        element: "tr",
        children: [
          new Template({
            element: "td",
            props: {
              colspan: 2,
            },
            children: [
              new Template({
                element: "table",
                props: {
                  class: "table-layout",
                  bordered: "false",
                },
                children: [
                  new Template({
                    element: "tr",
                    style: {
                      "vertical-align": "top",
                    },
                    children: [
                      new Template({
                        element: "td",

                        children: [
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_lr_number"
                                ),
                                new Filler("lr_no"),
                              ],
                            },
                            "dispatch_details_lr_number"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_transporter_name"
                                ),
                                new Filler("transporter_name"),
                              ],
                            },
                            "dispatch_details_transporter_name"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_driver_name"
                                ),
                                new Filler("driver_name"),
                              ],
                            },
                            "dispatch_details_driver_name"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_vehicle_number"
                                ),
                                new Filler("vehicle_number"),
                              ],
                            },
                            "dispatch_details_vehicle_number"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_freight"
                                ),
                                new Filler("freight_amount"),
                              ],
                            },
                            "dispatch_details_freight"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_payment"
                                ),
                                new Filler("payment_information"),
                              ],
                            },
                            "dispatch_details_payment"
                          ),
                        ],
                      }),
                      new Template({
                        element: "td",

                        children: [
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " : "],
                                  },
                                  "dispatch_details_order_number"
                                ),
                                new Filler("invoice_number"),
                              ],
                            },
                            "dispatch_details_order_number"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " :"],
                                  },
                                  "dispatch_details_transporter_number"
                                ),
                                new Filler("transporter_mobile_number"),
                              ],
                            },
                            "dispatch_details_transporter_number"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " :"],
                                  },
                                  "dispatch_details_driver_number"
                                ),
                                new Filler("driver_mobile_number"),
                              ],
                            },
                            "dispatch_details_driver_number"
                          ),
                          new Template(
                            {
                              element: "h4",
                              children: [
                                new Template(
                                  {
                                    element: "span",
                                    props: {
                                      blur: true,
                                    },
                                    children: [new Label(), " :"],
                                  },
                                  "dispatch_details_broker_details"
                                ),
                                new Filler("broker_information"),
                              ],
                            },
                            "dispatch_details_broker_details"
                          ),

                          new Template(
                            {
                              element: "table",
                              props: {
                                class: "table-layout",
                                bordered: "false",
                              },
                              children: [
                                new Template({
                                  element: "tr",
                                  style: {
                                    "vertical-align": "top",
                                  },
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
                                            children: [new Label(), " :"],
                                          },
                                          "dispatch_details_attachments"
                                        ),
                                      ],
                                    }),
                                    "{% for s3_data in lr_images %}",
                                    new Template({
                                      element: "td",
                                      children: [
                                        new Template({
                                          element: "a",
                                          props: {
                                            href: "",
                                          },
                                          children: [
                                            new Template({
                                              element: "h4",
                                              children: [
                                                new Filler("s3_data.file_name"),
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
                            "dispatch_details_attachments"
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  },
  "dispatch_details"
);
