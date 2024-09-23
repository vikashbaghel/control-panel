import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

export default new Template(
  {
    element: "table",
    props: { class: "table-layout mt" },
    children: [
      new Template({
        element: "tr",
        children: [
          new Template({
            element: "td",
            children: [
              new Template(
                {
                  element: "h4",
                  props: {
                    align: "center",
                    theme: true,
                    bold: true,
                  },
                  children: [new Label()],
                },
                "comments"
              ),
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
                children: [new Filler("comment")],
              }),
            ],
          }),
        ],
      }),
    ],
  },
  "comments"
);
