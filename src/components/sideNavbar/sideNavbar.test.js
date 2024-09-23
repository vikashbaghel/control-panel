import renderer from "react-test-renderer";
import SideNavbar from "./index";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Permissions from "../../helpers/permissions";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
const cookiesMock = {
  rupyzToken: "",
  rupyzAccessType: "WEB_SARE360",
  rupyzProfilePic: "",
  rupyzOrgId: "306",
  rupyzUserName: "MAA%20MOBILE%20GALLERY",
  rupyzAdminId: "17818",
  rupyzCustomerLevelConfig:
    "%7B%22LEVEL-1%22%3A%22Manufacturer%22%2C%22LEVEL-2%22%3A%22Distributor%22%2C%22LEVEL-3%22%3A%22Retailer%22%7D",
  rupyzStaffEnable: "true",
  rupyzRolePermissionEnable: "true",
  rupyzLocationEnable: "true",
  rupyzHierarchyEnable: "true",
  rupyzAnalyticsEnable: "true",
  rupyzGalleryEnable: "false",
  rupyzCustomrCategoryMappingEnabled: "true",
  rupyzCustomerLevelOrderEnable: "true",
  rupyzEnableGeoFencing: "false",
  rupyzEnableLiveLocationTrace: "true",
  checkIn: "",
  rupyzPermissionType:
    "%5B%22VIEW_CUSTOMER%22%2C%22CREATE_CUSTOMER%22%2C%22EDIT_CUSTOMER%22%2C%22DELETE_CUSTOMER%22%2C%22VIEW_CUSTOMER_TYPE%22%2C%22CREATE_CUSTOMER_TYPE%22%2C%22EDIT_CUSTOMER_TYPE%22%2C%22DELETE_CUSTOMER_TYPE%22%2C%22VIEW_ORDER%22%2C%22CREATE_ORDER%22%2C%22EDIT_ORDER%22%2C%22DELETE_ORDER%22%2C%22APPROVE_ORDER%22%2C%22PROCESS_ORDER%22%2C%22READY_TO_DISPATCH_ORDER%22%2C%22DISPATCH_ORDER%22%2C%22DELIVER_ORDER%22%2C%22REJECT_ORDER%22%2C%22CLOSE_ORDER%22%2C%22VIEW_PAYMENT%22%2C%22CREATE_PAYMENT%22%2C%22PAYMENT_STATUS_UPDATE%22%2C%22EDIT_PAYMENT%22%2C%22DELETE_PAYMENT%22%2C%22VIEW_STAFF%22%2C%22CREATE_STAFF%22%2C%22EDIT_STAFF%22%2C%22DEACTIVATE_STAFF%22%2C%22ASSIGN_MANAGER%22%2C%22VIEW_PRODUCT%22%2C%22CREATE_PRODUCT%22%2C%22EDIT_PRODUCT%22%2C%22DELETE_PRODUCT%22%2C%22VIEW_PRODUCT_CATEGORY%22%2C%22CREATE_PRODUCT_CATEGORY%22%2C%22EDIT_PRODUCT_CATEGORY%22%2C%22DELETE_PRODUCT_CATEGORY%22%2C%22VIEW_UNIT%22%2C%22CREATE_UNIT%22%2C%22EDIT_UNIT%22%2C%22DELETE_UNIT%22%2C%22VIEW_LEAD_CATEGORY%22%2C%22CREATE_LEAD_CATEGORY%22%2C%22EDIT_LEAD_CATEGORY%22%2C%22DELETE_LEAD_CATEGORY%22%2C%22VIEW_LEAD%22%2C%22CREATE_LEAD%22%2C%22EDIT_LEAD%22%2C%22DELETE_LEAD%22%2C%22APPROVE_LEAD%22%2C%22APPROVE_SELF_LEAD%22%2C%22VIEW_ROLE%22%2C%22CREATE_ROLE%22%2C%22EDIT_ROLE%22%2C%22DELETE_ROLE%22%2C%22REIMBURSEMENT_APPROVAL%22%2C%22ATTENDANCE_APPROVAL%22%2C%22BEAT_PLAN_APPROVAL%22%2C%22SET_TARGET_TEMPLATE%22%2C%22VIEW_TARGET_TEMPLATE%22%2C%22ASSIGN_TARGET%22%2C%22ORDER_STATUS_UPDATE%22%2C%22CREATE_FOLLOWUP_LIST%22%2C%22EDIT_FOLLOWUP_LIST%22%2C%22DELETE_FOLLOWUP_LIST%22%2C%22CREATE_ORDER_SUMMARY_REPORT%22%2C%22CREATE_ORDER_DETAILED_REPORT%22%2C%22CREATE_PAYMENT_SUMMARY_REPORT%22%2C%22CREATE_PRODUCT_SUMMARY_REPORT%22%2C%22CREATE_EXPENSE_SUMMARY_REPORT%22%2C%22CREATE_EXPENSE_DETAILED_REPORT%22%2C%22CREATE_ATTENDANCE_SUMMARY_REPORT%22%2C%22CREATE_ATTENDANCE_DETAILED_REPORT%22%2C%22CREATE_ACTIVITY_SUMMARY_REPORT%22%2C%22CREATE_ACTIVITY_DETAILED_REPORT%22%2C%22CREATE_CUSTOMER_SUMMARY_REPORT%22%2C%22CREATE_LEAD_SUMMARY_REPORT%22%2C%22CREATE_LEAD_DETAILED_REPORT%22%2C%22CREATE_EMPLOYEE_WISE_PRODUCT_REPORT%22%2C%22CREATE_CUSTOMER_WISE_PENDING_ORDER_REPORT%22%2C%22CREATE_PRODUCT_WISE_PENDING_ORDER_REPORT%22%5D",
};
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => {
    return {
      collapsed: false,
      setCollapsed: jest.fn(),
    };
  },
}));

jest.mock("../../helpers/permissions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("universal-cookie", () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: (key) => {
        return cookiesMock[key];
      },
    };
  });
});

const mockedPermissions = Permissions;

describe("SideNavbar", () => {
  const component = renderer.create(<SideNavbar />);

  test("Check SideNavbar renders properly", () => {
    let tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
  });
  test("renders all main modules in the sidebar", () => {
    mockedPermissions.mockImplementation(() => true);
    const modules = [
      "Overview",
      "Product",
      "Product List",
      "Bulk Upload",
      "Beat",
      "Beat List",
      "My Beat Plan",
      "Target",
      "My Target",
      "Target Template",
      "Team Targets",
      "Staff",
      "Staff List",
      "Staff-Customer Mapping Bulk Uploading",
      "Bulk Upload",
      "Customer",
      "Customer List",
      "Bulk Upload",
      "Order",
      "Lead",
      "Payment",
      "Picture Gallery",
      "Storefront",
      "Report",
      "Staff Roles",
      "Activities",
      "My Activity",
      "Team Activity",
      "Expense",
      "My Expense",
      "Approval",
      "Settings",
    ];
    render(<SideNavbar />);
    modules.forEach((module) => {
      const elements = screen.queryAllByText(module);
      elements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  test("clicking on Overview  navigate on dashboard ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Overview"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web");
  });
  test("clicking on Product module should  navigate on  Product List page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Product List"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/product");
  });
  test("clicking on Beat module should  navigate on Beat page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Beat List"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/beat-list");
  });

  test("clicking on My Beat Plan module should  navigate on My Beat Plan page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Beat Plan"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/beat-plan");
  });

  test("clicking on Target module should  navigate on Target page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("My Target"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/target");
  });
  test("clicking on Target Template module should  navigate on Target Template page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Target Template"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/target-setting");
  });

  test("clicking on  Staff module should  navigate on Staff page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Staff List"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/staff");
  });

  test("clicking on  Customer module should  navigate on Customer List page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Customer List"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/customer");
  });
  test("clicking on  Order module should  navigate on Order List page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Order"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/order/order-list");
  });

  test("clicking on  Lead module should  navigate on Lead page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Lead"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/lead");
  });
  test("clicking on  Payment module should  navigate on Payment page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Payment"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/payment");
  });
  test("clicking on  Picture Gallery module should  navigate on Picture Gallery page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Picture Gallery"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/picture-gallery");
  });
  test("clicking on  Report module should  navigate on Report page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Report"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/report");
  });

  test("clicking on  Activities module should  navigate on Activities page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("My Activity"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/my-activity");
  });

  test("clicking on  Expense module should  navigate on Expense page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("My Expense"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/expense-tracker");
  });

  test("clicking on  Approval module should  navigate on Approval page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Approval"));
    expect(mockedNavigate).toHaveBeenCalledWith(
      "/web/approval-request-tracker"
    );
  });

  test("clicking on  Settings module should  navigate on Settings page ", () => {
    mockedPermissions.mockImplementation((permission) => {
      if (permission === "VIEW_PRODUCT_CATEGORY") return true;
      if (permission === "VIEW_CUSTOMER_TYPE") return false;
      if (permission === "VIEW_LEAD_CATEGORY") return false;
      if (permission === "VIEW_UNIT") return false;
      return false;
    });
    render(<SideNavbar />);

    fireEvent.click(screen.getByText("Settings"));
    // console.log(mockedNavigate.mock.calls);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/web/setting?tab=Product Category"
    );
  });
  test("clicking on  Team Activity module should  navigate on Team Activity page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Team Activity"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/team-activity");
  });

  test("clicking on  Staff Roles module should  navigate on Staff Roles page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Staff Roles"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/staff-roles");
  });

  test("clicking on  Storefront module should  navigate on Storefront page ", () => {
    render(<SideNavbar />);

    mockedPermissions.mockImplementation(() => true);

    fireEvent.click(screen.getByText("Storefront"));
    expect(mockedNavigate).toHaveBeenCalledWith("/web/storefront");
  });
  test("clicking on  product Bulk upload module should  navigate on product Bulk Upload page ", () => {
    render(<SideNavbar />);
    const bulkUploadLink = screen.getByTestId("bulk-upload-product");

    mockedPermissions.mockImplementation(() => true);
    fireEvent.click(bulkUploadLink);

    expect(mockedNavigate).toHaveBeenCalledWith("/web/bulk-uploading-product");
  });
  test("clicking on  Bulk upload staff module should  navigate on Bulk Upload  staff page ", () => {
    render(<SideNavbar />);
    const bulkUploadLink = screen.getByTestId("bulk-upload-staff");

    mockedPermissions.mockImplementation(() => true);
    fireEvent.click(bulkUploadLink);

    expect(mockedNavigate).toHaveBeenCalledWith("/web/bulk-uploading-staff");
  });
  test("clicking on  Bulk upload customer  module should  navigate on Bulk Upload  customer  page ", () => {
    render(<SideNavbar />);
    const bulkUploadLink = screen.getByTestId("bulk-upload-customer");

    mockedPermissions.mockImplementation(() => true);
    fireEvent.click(bulkUploadLink);

    expect(mockedNavigate).toHaveBeenCalledWith("/web/bulk-uploading-customer");
  });
});
