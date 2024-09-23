import Comments from "./Comments";
import HeaderTag from "./HeaderTag";
import PdfHeader from "./PdfHeader";
import OrderDetails from "./OrderDetails";
import domTemplates from "../domTemplates";
import ProductDetails from "./ProductDetails";
import TotalQtyDetails from "./TotalQtyDetails";
import DispatchDetails from "./DispatchDetails";
import ShipmentDetails from "./ShipmentDetails";
import OrderAmountDetails from "./OrderAmountDetails";
import Terms from "./Terms";

const reportElements = {
  header_tag: HeaderTag,
  pdf_header: PdfHeader,
  order_details: OrderDetails,
  shipment_details: ShipmentDetails,
  dispatch_details: DispatchDetails,
  product_details: ProductDetails,
  order_amount_details: OrderAmountDetails,
  total_qty: new domTemplates.Template(
    {
      element: "h3",
      props: {
        bold: true,
        class: "mt",
      },
      children: [new domTemplates.Label()],
    },
    "total_qty_details_label"
  ),
  total_qty_details: TotalQtyDetails,
  terms: Terms,
  comments: Comments,
  stamp_line: new domTemplates.Template({
    element: "h4",
    props: { class: "mt" },
    children: ["*This is a system generated copy. Signature not required"],
  }),
};
export default reportElements;
