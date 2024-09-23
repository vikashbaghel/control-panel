// import React, { useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { BASE_URL_V2, org_id } from "../../config";
// import axios from "axios";
// import Context from "../../context/Context";
// import { CloseOutlined } from "@ant-design/icons";
// import { Drawer, Button, Select, Form, Input, Tag } from "antd";
// import moment from "moment";
// import {
//   staffOrderService,
//   staffPaymentService,
// } from "../../redux/action/staffAction";
// import { customerEditDistributor } from "../../redux/action/customerAction";
// import Cookies from "universal-cookie";
// import { toIndianCurrency } from "../../helpers/convertCurrency";
// import { stateList } from "../../generic/list/stateList";
// import { paymentOptionList } from "../../generic/list/paymentOptionList";

// const EditRetailerDrawer = ({ id }) => {
//   const context = useContext(Context);
//   const {
//     setNewStaffData,
//     setNewStaffViewOrder,
//     editRetailerOpen,
//     setEditRetailerOpen,
//     setEditDistributorOpen,
//     setOrderViewOpen,
//     setCategoryFlag,
//     retailerDetails,
//     setRetailerDetails,
//   } = context;
//   const dispatch = useDispatch();
//   const state = useSelector((state) => state);
//   const [staffOrder, setStaffOrder] = useState("");
//   const [staffPayment, setStaffPayment] = useState("");
//   const [formInput, setFormInput] = useState("");
//   const [segmentApi, setSegmentApi] = useState("");
//   const [newData, setNewData] = useState([]);
//   const [pageNo, setPageNo] = useState(1);
//   const onClose = () => {
//     setEditRetailerOpen(false);
//     setNewStaffData("");
//     setNewStaffViewOrder("");
//     setRetailerDetails("");
//   };
//   const cookies = new Cookies();

//   const ContainerHeight = 300;

//   useEffect(() => {
//     // let id = rowData.id
//     dispatch(staffOrderService(id));
//     dispatch(staffPaymentService(id));
//   }, [id]);

//   useEffect(() => {
//     if (state.staffOrder.data !== "") {
//       if (state.staffOrder.data.data.error === false) {
//         state.staffOrder.data.data.data.map((ele) => {
//           ele.orderBy = ele.created_by.first_name;
//           ele.fullName = ele.customer.name;
//           ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
//           // ele.total_amount = '₹ ' + ele.total_amount
//         });
//         setStaffOrder(state.staffOrder.data.data.data);
//       }
//     }
//     if (state.staffPayment.data !== "") {
//       if (state.staffPayment.data.data.error === false) {
//         state.staffPayment.data.data.data.map((ele) => {
//           ele.fullName = ele.customer.name;
//           ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
//           ele.order_by =
//             ele.created_by.first_name + " " + ele.created_by.last_name;
//         });
//         setStaffPayment(state.staffPayment.data.data.data);
//       }
//     }
//   }, [state]);

//   const columnsOrder = [
//     {
//       title: "Order ID",
//       dataIndex: "order_id",
//     },
//     {
//       title: "Customer",
//       dataIndex: "fullName",
//     },
//     {
//       title: "Order By",
//       dataIndex: "orderBy",
//     },
//     {
//       title: "Amount",
//       dataIndex: "total_amount",
//       render: (text) => (
//         <div style={{ color: "black" }}>
//           {toIndianCurrency(text.toLocaleString("en"))}
//         </div>
//       ),
//     },
//     {
//       title: "Date",
//       dataIndex: "created_at",
//     },
//     {
//       title: "Status",
//       key: "tags",
//       dataIndex: "delivery_status",
//       render: (_, { delivery_status }) => {
//         let color =
//           delivery_status === "Received" || delivery_status === "Pending"
//             ? "yellow"
//             : delivery_status === "Delivered"
//             ? "green"
//             : delivery_status === "Rejected"
//             ? "red"
//             : delivery_status === "Approved"
//             ? "purple"
//             : delivery_status === "Processing"
//             ? "blue"
//             : delivery_status === "Shipped"
//             ? "green"
//             : "gray";
//         return (
//           <Tag color={color} key={delivery_status}>
//             {delivery_status.toUpperCase()}
//           </Tag>
//         );
//       },
//     },
//   ];

//   const columnsPayment = [
//     {
//       title: "Customer",
//       dataIndex: "fullName",
//     },

//     {
//       title: "Date",
//       dataIndex: "created_at",
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       render: (text) => (
//         <div style={{ color: "black" }}>
//           {toIndianCurrency(text.toLocaleString("en"))}
//         </div>
//       ),
//     },
//     {
//       title: "Payment Mode",
//       dataIndex: "payment_mode",
//     },
//   ];

//   const onFinish = (values) => {
//     if (values.name !== "") {
//       const apiData = {
//         id: retailerDetails.id,
//         name: values
//           ? values.name
//           : retailerDetails.name
//           ? retailerDetails.name
//           : "",
//         pan_id: values.pan_id
//           ? values.pan_id
//           : retailerDetails.pan_id
//           ? retailerDetails.pan_id
//           : "",
//         gstin: values.gst_number
//           ? values.gst_number
//           : retailerDetails.gstin
//           ? retailerDetails.gstin
//           : "",
//         mobile: values.mobile ? values.mobile : retailerDetails.mobile,
//         email: values.email ? values.email : retailerDetails.email,
//         contact_person_name: values.contact_person_name
//           ? values.contact_person_name
//           : retailerDetails.contact_person_name,
//         customer_type: values.customer_type
//           ? values.customer_type
//           : retailerDetails.customer_type,
//         address_line_1: values.address
//           ? values.address
//           : retailerDetails.address_line_1,
//         state: values.state ? values.state : retailerDetails.state,
//         city: values.city ? values.city : retailerDetails.city,
//         pincode: values.pincode
//           ? values.pincode
//           : retailerDetails.pincode
//           ? retailerDetails.pincode
//           : "",
//         payment_term: values.payment_term
//           ? values.payment_term
//           : retailerDetails.payment_term
//           ? retailerDetails.payment_term
//           : "",
//         credit_limit: Number(
//           values.credit_limit
//             ? values.credit_limit
//             : retailerDetails.credit_limit
//             ? retailerDetails.credit_limit
//             : ""
//         ),
//         outstanding_amount: Number(
//           values.outstanding_amount
//             ? values.outstanding_amount
//             : retailerDetails.outstanding_amount
//             ? retailerDetails.outstanding_amount
//             : ""
//         ),
//         segment_name: values.category
//           ? values.category
//           : retailerDetails.segment_name
//           ? retailerDetails.segment_name
//           : "",
//         staff_set: retailerDetails.staff_set,
//       };
//       setFormInput(apiData);
//       dispatch(customerEditDistributor(apiData));
//     }
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };

//   const layout = {
//     labelCol: { span: 8 },
//     wrapperCol: { span: 16 },
//   };

//   /* eslint-disable no-template-curly-in-string */
//   const validateMessages = {
//     required: "${label} is required!",
//     types: {
//       email: "${label} is not a valid email!",
//       number: "${label} is not a valid number!",
//     },
//     number: {
//       range: "${label} must be between ${min} and ${max}",
//     },
//   };

//   const appendData = () => {
//     const url = `${BASE_URL_V2}/organization/${org_id}/staff/?page_no=${Number(
//       pageNo
//     )}`;
//     const headers = { Authorization: cookies.get("rupyzToken") };
//     axios.get(url, { headers }).then((response) => {
//       setNewData(newData.concat(response.data.data));
//       setPageNo(pageNo + 1);
//     });
//   };
//   useEffect(() => {
//     appendData();
//   }, []);

//   const onScroll = (e) => {
//     if (
//       e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
//       ContainerHeight
//     ) {
//       appendData();
//     }
//   };

//   return (
//     <>
//       {/* {""} */}
//       {retailerDetails && (
//         <>
//           <Drawer
//             className="container"
//             title={
//               <>
//                 <CloseOutlined onClick={onClose} />{" "}
//                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                 <span>Edit Retailer</span>
//               </>
//             }
//             width={520}
//             closable={false}
//             onClose={onClose}
//             open={editRetailerOpen}
//             style={{ overflowY: "auto" }}
//           >
//             <Form
//               {...layout}
//               onFinish={onFinish}
//               onFinishFailed={onFinishFailed}
//               validateMessages={validateMessages}
//             >
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="pan_id"
//                 label="Business PAN "
//               >
//                 <Input
//                   placeholder="PAN ID"
//                   defaultValue={retailerDetails.pan_id}
//                   // minLength="10"
//                   maxLength="10"
//                   // onKeyPress={(e) => {
//                   //   if (!/[A-Z0-9]/.test(e.key)) {
//                   //     e.preventDefault();
//                   //   }
//                   // }}
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="name"
//                 label="Business Name"
//               >
//                 <Input
//                   placeholder="Business Name"
//                   defaultValue={retailerDetails.name}
//                   onKeyPress={(e) => {
//                     if (!/[A-Z0-9a-z ]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </Form.Item>
//               <p style={{ display: "flex", justifyContent: "end" }}>
//                 <a
//                   style={{ color: "green", float: "right", fontWeight: "bold" }}
//                   onClick={() => {
//                     setOrderViewOpen(true);
//                     setCategoryFlag(false);
//                     setEditDistributorOpen(false);
//                   }}
//                 >
//                   Add Segmant
//                 </a>
//               </p>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="category"
//                 label="Select Segment"
//                 hasFeedback
//               >
//                 <Select
//                   name="category"
//                   id="select"
//                   defaultValue={retailerDetails.segment_name}
//                   style={{ width: "300px" }}
//                 >
//                   {segmentApi &&
//                     segmentApi.map((ele) => (
//                       <option key={ele} value={ele.name}>
//                         {ele.name}
//                       </option>
//                     ))}
//                 </Select>
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="gst_number"
//                 label="GST No"
//               >
//                 <Input
//                   placeholder="GST Number"
//                   defaultValue={retailerDetails.gstin}
//                   minLength="15"
//                   maxLength="15"
//                   onKeyPress={(e) => {
//                     if (!/[A-Z0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="contact_person_name"
//                 label="Contact Person"
//               >
//                 <Input
//                   placeholder="Contact Person "
//                   defaultValue={retailerDetails.contact_person_name}
//                   onKeyPress={(e) => {
//                     if (!/[A-Z0-9a-z ]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </Form.Item>
//               {/* <Form.Item
//             style={{ fontWeight: '600' }}
//             name="customer_type"
//             label="Customer Type"
//           >
//             <Input placeholder="Customer Type" defaultValue={distributorDetails.customer_type} />
//           </Form.Item> */}
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="customer_type"
//                 label="Customer Type"
//                 hasFeedback
//                 rules={[
//                   {
//                     whitespace: true,
//                   },
//                 ]}
//               >
//                 <Select
//                   // defaultValue="disabled"
//                   defaultValue={retailerDetails.customer_type}
//                   style={{
//                     width: 295,
//                     marginLeft: 10,
//                   }}
//                   options={[
//                     {
//                       value: "disabled",
//                       disabled: true,
//                       label: "Select",
//                     },

//                     {
//                       value: "Distributor",
//                       label: "Distributor",
//                     },
//                     {
//                       value: "Retailer",
//                       label: "Retailer",
//                     },
//                   ]}
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="mobile"
//                 label="Mobile"
//                 // rules={[,{min:10 ,max:10 ,message:"Enter 10 Digit Mobile Number"}]}
//               >
//                 <Input
//                   placeholder="Mobile"
//                   defaultValue={retailerDetails.mobile}
//                   // type= 'number'
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputmode="numeric"
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="email"
//                 label="Email"
//               >
//                 <Input
//                   placeholder="Email ID"
//                   defaultValue={retailerDetails.email}
//                 />
//               </Form.Item>
//               {/* address */}
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="address"
//                 label=" Address"
//               >
//                 <Input
//                   placeholder="Address"
//                   defaultValue={retailerDetails.address_line_1}
//                 />
//               </Form.Item>
//               <Form.Item style={{ fontWeight: "600" }} name="city" label="City">
//                 <Input placeholder="City" defaultValue={retailerDetails.city} />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="state"
//                 label="State"

//                 // defaultValue={state1}
//               >
//                 {/* <Input placeholder='PAN ID' /> */}
//                 <Select
//                   defaultValue={retailerDetails.state}
//                   style={{
//                     width: 295,
//                     marginLeft: 10,
//                   }}
//                   options={stateList}
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="pincode"
//                 label="PIN Code"
//               >
//                 <Input
//                   placeholder="PIN Code"
//                   defaultValue={retailerDetails.pincode}
//                   // type= 'number'
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputmode="numeric"
//                 />
//               </Form.Item>
//               {/* payment */}
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="payment_term"
//                 label="Payment Terms"
//                 // defaultValue={payment_term}
//               >
//                 {/* <Input placeholder='PAN ID' /> */}
//                 <Select
//                   // defaultValue="disabled"
//                   defaultValue={retailerDetails.payment_term}
//                   style={{
//                     width: 295,
//                     marginLeft: 10,
//                   }}
//                   options={[
//                     ...paymentOptionList,
//                     {
//                       value: "disabled",
//                       disabled: true,
//                       label: "Select",
//                     },
//                   ]}
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="credit_limit"
//                 label="Credit Limit"
//               >
//                 <Input
//                   placeholder="Credit Limit"
//                   defaultValue={retailerDetails.credit_limit}
//                   //  type= 'number' step="0.01"
//                   onKeyPress={(e) => {
//                     if (!/[0-9.]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputmode="numeric"
//                 />
//               </Form.Item>
//               <Form.Item
//                 style={{ fontWeight: "600" }}
//                 name="outstanding_amount"
//                 label="Outstading Amount"
//               >
//                 <Input
//                   placeholder="Outstanding Amount"
//                   defaultValue={retailerDetails.outstanding_amount}
//                   // type= 'number' step="0.01"
//                   onKeyPress={(e) => {
//                     if (!/[0-9.]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputmode="numeric"
//                 />
//               </Form.Item>
//               <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
//                 <Button type="primary" htmlType="submit">
//                   Submit
//                 </Button>
//               </Form.Item>
//             </Form>
//           </Drawer>
//         </>
//       )}
//     </>
//   );
// };
// export default EditRetailerDrawer;

// const marginStyleForP = {
//   margin: "5px",
//   fontWeight: "bold",
// };
