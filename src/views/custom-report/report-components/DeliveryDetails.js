import domTemplates from "../domTemplates";

const { Template, Filler, Label } = domTemplates;

// eslint-disable-next-line import/no-anonymous-default-export
export default new Template(
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
        "delivery_details"
      ),
      new Template(
        {
          element: "h4",
          props: {
            bold: true,
          },
          children: [new Filler("delivery_location_name")],
        },
        "delivery_details_name"
      ),
      new Template(
        {
          element: "h4",
          children: [
            new Filler("delivery_location_address_line_1"),
            ", ",
            new Filler("delivery_location_city"),
          ],
        },
        "delivery_details_address"
      ),
      new Template(
        {
          element: "h4",
          children: [
            new Filler("delivery_location_state"),
            " - ",
            new Filler("delivery_location_pincode"),
          ],
        },
        "delivery_details_address"
      ),
      "{% if delivery_location_mobile %}",
      new Template({
        element: "h4",
        children: [new Filler("delivery_location_mobile")],
      }),
      "{% endif %}",
    ],
  },
  "delivery_details"
);
