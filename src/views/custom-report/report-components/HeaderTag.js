import domTemplates from "../domTemplates";

const { Template, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template(
  {
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
          }),
          new Template(
            {
              element: "td",
              props: {
                align: "right",
                class: "marker",
              },
              children: [new Label()],
            },
            "order_estimate"
          ),
        ],
      }),
    ],
  },
  "order_estimate"
);
