import domTemplates from "../domTemplates";

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
      props: {
        class: "mt",
      },
      children: [
        new Template({
          element: "td",
          props: {
            colspan: 2,
          },
          children: [
            new Template(
              {
                element: "h2",
                props: {
                  theme: true,
                  align: "center",
                  class: "mt",
                },
                children: [new Filler("seller_name")],
              },
              "name"
            ),
            new Template({
              element: "h3",
              props: {
                align: "center",
                class: "mt",
              },
              style: {
                margin: "0px 120px",
              },
              children: [
                new Filler("seller_address_line_1"),
                ", ",
                new Filler("seller_city"),
                ", ",
                new Filler("seller_state"),
                " - ",
                new Filler("seller_pincode"),
              ],
            }),
            new Template({
              element: "h3",
              props: {
                align: "center",
                class: "mt",
              },
              style: {
                margin: "0px 120px",
              },
              children: [
                new Template(
                  {
                    element: "div",
                    children: [
                      new Label(),
                      " : ",
                      new Filler("seller_gstin"),
                      '<span class="sep">|</span>',
                    ],
                  },
                  "gst"
                ),

                new Template(
                  {
                    element: "div",
                    children: [
                      new Label(),
                      " : ",
                      new Filler("seller_email"),
                      '<span class="sep">|</span>',
                    ],
                  },
                  "email"
                ),

                new Template(
                  {
                    element: "div",
                    children: [
                      new Label(),
                      " : +91-",
                      new Filler("seller_mobile"),
                    ],
                  },
                  "mobile"
                ),
              ],
            }),
            "{% if logo_image %}",
            new Template(
              {
                element: "img",
                props: {
                  src: new Filler("logo_image"),
                  class: "logo",
                },
              },
              "logo"
            ),
            "{% endif %}",
          ],
        }),
      ],
    }),
  ],
});
