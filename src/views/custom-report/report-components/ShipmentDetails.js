import domTemplates from "../domTemplates";
import BuyerDetails from "./BuyerDetails";
import DeliveryDetails from "./DeliveryDetails";

const { Template } = domTemplates;

export default new Template({
  element: "table",
  props: {
    class: "table-layout",
  },
  children: [
    new Template({
      element: "tr",
      style: {
        "vertical-align": "top",
      },
      children: [BuyerDetails, DeliveryDetails],
    }),
  ],
});
