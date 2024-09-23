import domTemplates from "../domTemplates";

const { Template, Filler } = domTemplates;

export default new Template(
  {
    element: "table",
    props: {
      class: "table-layout mt",
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
                children: [
                  "{% for total_qty in total_qty_packaging_unit_items %}",
                  new Filler("total_qty.name"),
                  " : ",
                  new Template({
                    element: "b",
                    children: [new Filler("total_qty.value")],
                  }),
                  ", ",
                  "{% endfor %}",
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  },
  "total_qty_details_label"
);
