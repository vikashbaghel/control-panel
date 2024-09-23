import {
  productUnSelectIcon,
  productCategorySelectIcon,
  productCategoryUnSelectIcon,
  ProductUnitIconActive,
  pricingGroupUnSelectIcon,
  pricingGroupSelectIcon,
  preferencesSelectIcon,
  preferences,
  leadUnSelectIcon,
  leadSelectIcon,
  customerTypeSelectIcon,
  customerTypeUnSelectIcon,
  BeatSelect,
  BeatUnSelect,
  AdminIconUnSelect,
  AdminIconSelect,
  ReportSelectedIcon,
  ReportUnSelectedIcon,
  WhatsAppIcon,
  WhatsAppIconSelected,
  CustomerActivity,
  CustomerActivitySelectedIcon,
  CustomFormIcon,
  customFormSelectIcon,
  CurrenciesSelected,
  CurrenciesUnselected,
} from "../../assets/settings";
import { Content } from "antd/es/layout/layout";
import Styles from "./settings.module.css";
import PreferencesComponents from "./preferences";
import ProductCategoryComponent from "./productCategory/productCategory";
import CustomerTypeComponent from "./customerType/customerType";
import LeadCategoryComponent from "./leadCategory";
import ProductUnitComponent from "./productUnit";
import PricingGroupComponent from "./pricingGroup";
import AdminComponent from "./admin";
import BeatComponent from "./beat";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import GetReportsComponent from "./getReport";
import CustomActivityType from "./customActivityType";
import Permissions from "../../helpers/permissions";
import CustomFormList from "./customFormList";
import CurrenciesComponent from "./Currencies";
import WhatsappSettings from "./whatsapp";

const cookies = new Cookies();
const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

const SettingsComponent = () => {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const selectSettingOption = queryParameters.get("tab");

  const tabOptions = {
    "Product Category": <ProductCategoryComponent />,
    "Customer Type": <CustomerTypeComponent />,
    Currencies: <CurrenciesComponent />,
    "Lead Category": <LeadCategoryComponent />,
    "Product Unit": <ProductUnitComponent />,
    "Pricing Group": <PricingGroupComponent />,
    "Schedule Reports": <GetReportsComponent />,
    Whatsapp: <WhatsappSettings />,
    Admin: <AdminComponent />,
    Customization: <CustomFormList />,
    Preferences: <PreferencesComponents />,
    "Custom Activity Type": <CustomActivityType />,
  };

  const settingOptionList = [
    ...(Permissions("VIEW_PRODUCT_CATEGORY")
      ? [
          {
            title: "Product Category",
            selectedImg: productCategorySelectIcon,
            unSelectedImg: productCategoryUnSelectIcon,
          },
        ]
      : []),
    ...(Permissions("VIEW_CUSTOMER_TYPE")
      ? [
          {
            title: "Customer Type",
            selectedImg: customerTypeSelectIcon,
            unSelectedImg: customerTypeUnSelectIcon,
          },
        ]
      : []),
    ...(Permissions("VIEW_LEAD_CATEGORY")
      ? [
          {
            title: "Lead Category",
            selectedImg: leadSelectIcon,
            unSelectedImg: leadUnSelectIcon,
          },
        ]
      : []),
    ...(Permissions("VIEW_UNIT")
      ? [
          {
            title: "Product Unit",
            selectedImg: ProductUnitIconActive,
            unSelectedImg: productUnSelectIcon,
          },
        ]
      : []),
    ...(admin
      ? [
          {
            title: "Currencies",
            selectedImg: CurrenciesSelected,
            unSelectedImg: CurrenciesUnselected,
          },
          {
            title: "Pricing Group",
            selectedImg: pricingGroupSelectIcon,
            unSelectedImg: pricingGroupUnSelectIcon,
          },
          {
            title: "Schedule Reports",
            selectedImg: ReportUnSelectedIcon,
            unSelectedImg: ReportSelectedIcon,
          },
          {
            title: "Whatsapp",
            selectedImg: WhatsAppIconSelected,
            unSelectedImg: WhatsAppIcon,
          },
          {
            title: "Admin",
            selectedImg: AdminIconSelect,
            unSelectedImg: AdminIconUnSelect,
          },
          {
            title: "Customization",
            selectedImg: customFormSelectIcon,
            unSelectedImg: CustomFormIcon,
          },
          {
            title: "Preferences",
            selectedImg: preferencesSelectIcon,
            unSelectedImg: preferences,
          },
          {
            title: "Custom Activity Type",
            selectedImg: CustomerActivitySelectedIcon,
            unSelectedImg: CustomerActivity,
          },
        ]
      : []),
  ];

  return (
    <>
      <br />
      <br />
      <div className="table_list position-rel">
        <h2 className="page_title">Settings</h2>
        <Content
          style={{
            padding: 24,
            margin: 0,
            height: "82vh",
            background: "transparent",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className={Styles.setting_options_main}>
              {settingOptionList.map((value, index) => (
                <div
                  onClick={() => {
                    navigate(`/web/setting?tab=${value.title}`);
                  }}
                  className={
                    selectSettingOption !== value.title
                      ? Styles.setting_options
                      : Styles.setting_options_select_active
                  }
                >
                  <img
                    width={"25px"}
                    src={
                      selectSettingOption !== value.title
                        ? value.unSelectedImg
                        : value.selectedImg
                    }
                    alt="product"
                  />
                  <div
                    className={
                      selectSettingOption !== value.title
                        ? ""
                        : Styles.setting_options_active
                    }
                  >
                    {value.title}
                  </div>
                </div>
              ))}
            </div>
            {tabOptions[selectSettingOption]}
          </div>
        </Content>
      </div>
    </>
  );
};

export default SettingsComponent;
