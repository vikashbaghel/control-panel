export let smartRoleArray = [
  //  customer related permissions
  {
    action: [
      "CREATE_CUSTOMER_TYPE",
      "EDIT_CUSTOMER_TYPE",
      "DELETE_CUSTOMER_TYPE",
      "CREATE_CUSTOMER",
      "EDIT_CUSTOMER",
    ],
    result: "VIEW_CUSTOMER_TYPE",
  },
  {
    action: [
      "CREATE_CUSTOMER",
      "EDIT_CUSTOMER",
      "DELETE_CUSTOMER",
      "CREATE_STAFF",
      "EDIT_STAFF",
      "CREATE_ORDER",
      "EDIT_ORDER",
      "CREATE_PAYMENT",
      "VIEW_PAYMENT",
      "PAYMENT_STATUS_UPDATE",
      "EDIT_PAYMENT",
      "BEAT_PLAN_APPROVAL",
    ],
    result: "VIEW_CUSTOMER",
  },

  //  order related permissions
  {
    action: [
      "CREATE_ORDER",
      "EDIT_ORDER",
      "APPROVE_ORDER",
      "PROCESS_ORDER",
      "READY_TO_DISPATCH_ORDER",
      "DISPATCH_ORDER",
      "DELIVER_ORDER",
      "REJECT_ORDER",
      "CLOSE_ORDER",
      "DELETE_ORDER",
    ],
    result: "VIEW_ORDER",
  },

  //  payment related permissions
  {
    action: [
      "CREATE_PAYMENT",
      "PAYMENT_STATUS_UPDATE",
      "EDIT_PAYMENT",
      "DELETE_PAYMENT",
    ],
    result: "VIEW_PAYMENT",
  },
  {
    action: [
      "CREATE_STAFF",
      "EDIT_STAFF",
      "DEACTIVATE_STAFF",
      "ASSIGN_TARGET",
      "ASSIGN_MANAGER",
      "SET_TARGET_TEMPLATE",
      "REIMBURSEMENT_APPROVAL",
      "BEAT_PLAN_APPROVAL",
    ],
    result: "VIEW_STAFF",
  },
  {
    action: ["ASSIGN_MANAGER"],
    result: "EDIT_STAFF",
  },

  // target related Permission
  {
    action: ["ASSIGN_TARGET", "SET_TARGET_TEMPLATE"],
    result: "VIEW_TARGET_TEMPLATE",
  },

  //  product related Permissions
  {
    action: [
      "CREATE_PRODUCT",
      "EDIT_PRODUCT",
      "DELETE_PRODUCT",
      "CREATE_ORDER",
      "EDIT_ORDER",
      "SET_TARGET_TEMPLATE",
      "ASSIGN_TARGET",
    ],
    result: "VIEW_PRODUCT",
  },
  {
    action: [
      "CREATE_PRODUCT_CATEGORY",
      "EDIT_PRODUCT_CATEGORY",
      "DELETE_PRODUCT_CATEGORY",
      "CREATE_CUSTOMER",
      "CREATE_PRODUCT",
      "EDIT_PRODUCT",
    ],
    result: "VIEW_PRODUCT_CATEGORY",
  },
  {
    action: [
      "CREATE_UNIT",
      "EDIT_UNIT",
      "DELETE_UNIT",
      "CREATE_PRODUCT",
      "EDIT_PRODUCT",
    ],
    result: "VIEW_UNIT",
  },

  //  Lead Related Permissions
  {
    action: [
      "CREATE_LEAD_CATEGORY",
      "EDIT_LEAD_CATEGORY",
      "DELETE_LEAD_CATEGORY",
      "CREATE_LEAD",
      "EDIT_LEAD",
    ],
    result: "VIEW_LEAD_CATEGORY",
  },
  {
    action: [
      "CREATE_LEAD",
      "EDIT_LEAD",
      "APPROVE_LEAD",
      "APPROVE_SELF_LEAD",
      "DELETE_LEAD",
    ],
    result: "VIEW_LEAD",
  },

  //  Role Related Permissions
  {
    action: [
      "CREATE_ROLE",
      "EDIT_ROLE",
      "DELETE_ROLE",
      "CREATE_STAFF",
      "EDIT_STAFF",
    ],
    result: "VIEW_ROLE",
  },
];
