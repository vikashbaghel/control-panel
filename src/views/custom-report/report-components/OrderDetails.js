import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template({
  element: "table",
  children: [
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
                  children: [
                    new Template({
                      element: "td",
                      children: [
                        new Template({
                          element: "h4",
                          props: {
                            theme: true,
                            bold: true,
                          },
                          children: [
                            new Template(
                              {
                                element: "p",
                                children: [
                                  new Label(),
                                  " ",
                                  new Filler("order_no"),
                                ],
                              },
                              "order_details_order_no"
                            ),
                          ],
                        }),
                      ],
                    }),
                    new Template({
                      element: "td",
                      props: {
                        align: "right",
                      },
                      children: [
                        new Template({
                          element: "h4",
                          props: {
                            theme: true,
                            bold: true,
                          },
                          children: [
                            new Template(
                              {
                                element: "p",
                                children: [
                                  new Label(),
                                  " : ",
                                  new Filler("payment_terms"),
                                ],
                              },
                              "order_details_payment_terms"
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new Template({
                  element: "tr",
                  children: [
                    new Template({
                      element: "td",
                      children: [
                        new Template({
                          element: "p",
                          props: {
                            class: "mt",
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                new Template({
                  element: "tr",
                  children: [
                    new Template({
                      element: "td",
                      children: [
                        new Template({
                          element: "h4",
                          props: {
                            bold: true,
                            theme: true,
                          },
                          children: [
                            new Template(
                              {
                                element: "p",
                                children: [
                                  new Label(),
                                  " : ",
                                  new Filler("order_date"),
                                ],
                              },
                              "order_details_order_date"
                            ),
                          ],
                        }),
                      ],
                    }),
                    new Template({
                      element: "td",
                      props: {
                        align: "right",
                      },
                      children: [
                        new Template({
                          element: "h4",
                          props: {
                            theme: true,
                            bold: true,
                          },
                          children: [
                            new Template(
                              {
                                element: "p",
                                children: [
                                  new Label(),
                                  " : ",
                                  new Filler("user_name"),
                                ],
                              },
                              "order_details_staff_name"
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
    }),
  ],
});
