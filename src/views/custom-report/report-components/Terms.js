import domTemplates from "../domTemplates";

const { Template, Label, Collection } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
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
                "terms_section"
              ),
            ],
          }),
          new Collection("terms"),
        ],
      }),
    ],
  },
  "terms_section"
);
