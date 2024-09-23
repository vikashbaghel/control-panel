// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/180748290/Form+Specifications#Customer-Form-(Add%2FEdit)

import { useContext, useState } from "react";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import {
  customerAddDistributor,
  customerDetails,
} from "../../redux/action/customerAction";
import styles from "./customer.module.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../assets/globle";
import FormStepper from "../../components/formStepper/formStepper";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Space, notification } from "antd";
import { preferencesAction } from "../../redux/action/preferencesAction";
import { singleLeadDataAction } from "../../redux/action/leadManagementAction";
import { pricingGroupListService } from "../../redux/action/pricingGroupAction";
import BackConfirmationModal from "../../components/back-confirmation/BackConfirmationModal";
import Context from "../../context/Context";
import { getGeoLocationAndAddress } from "../../services/location-service";
import customFormAction from "../../redux/action/customFormAction";
import CustomForm, { createPostFormData } from "../custom-forms";
import CustomerLevelFormItems from "./customerFormItems/customerLevel";
import CustomerType from "./customerFormItems/customerType";
import State from "./customerFormItems/state";
import PaymentTerm from "./customerFormItems/PaymentTerm";
import GeoAddress from "./customerFormItems/geoAddress";
import PricingGroup from "./customerFormItems/pricingGroup";
import { removeEmpty } from "../../helpers/globalFunction";
import FormPreview from "./formPreview";
import BusinessName from "./customerFormItems/businessName";
import GSTField from "./customerFormItems/gstField";
import Pincode from "./customerFormItems/Pincode";
import ContactPerson from "./customerFormItems/contactPerson";
import moment from "moment";
import WhatsappNumber from "./customerFormItems/whatsappNumber";
import {
  SelectBeat,
  SelectProductCategory,
  SelectStaff,
} from "./customerFormItems/AssignComponents";

function Wrapper({ section, children }) {
  return (
    <div className={styles.form}>
      <div className={styles.form_header} style={{ paddingBottom: "1em" }}>
        {section.name}
      </div>
      {children}
    </div>
  );
}

const AddCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { disributor_details, gst } = state;
  const cookies = new Cookies();

  const [form] = Form.useForm();

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
  const lead_id = queryParameters.get("lead_id");

  const context = useContext(Context);
  const { setDiscardModalAction } = context;
  const [isValueChange, setIsValueChange] = useState(false);

  const [formCount, setFormCount] = useState(1);
  const [formConfig, setFormConfig] = useState({ sections: [] });

  const [formInput, setFormInput] = useState(initialInput);

  // for loading on succes button
  const [isLoading, setIsLoading] = useState(false);

  // setting the form Input fields is there is any id present
  const handleLeadDetails = (data) => {
    if (formCount !== 1) return;
    form.setFieldsValue({
      name: data.business_name,
      gstin: data.gstin,
      contact_person_name: data.contact_person_name,
      mobile: data.mobile,
      email: data.email,
      address_line_1: data.address_line_1,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });
    setFormInput({
      ...formInput,
      geo_address: data.geo_address,
      lead: lead_id,
      prev_mobile: data.mobile,
    });
  };

  // setting the form Input fields is there is any id present
  const handleCustomerDetails = (data) => {
    if (formCount !== 1) return;
    form.setFieldsValue({
      ...arrayToObject(
        data.custom_form_data.length > 0 ? data.custom_form_data : []
      ),
      gstin: data.gstin,
      name: data.name,
      mobile: data.mobile,
      pan_id: data.pan_id,
      contact_person_name: data.contact_person_name,
      contact_mobile: data.contact_mobile,
      customer_type: data.customer_type || null,
      email: data.email,
      customer_level: data.customer_level,
      customer_parent: {
        id: data.customer_parent || "",
        name: data.customer_parent_name || "",
      },
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      payment_term: data.payment_term || null,
      credit_limit: data.credit_limit || "",
      outstanding_amount: data.outstanding_amount || "",
      pricing_group: data.pricing_group
        ? {
            id: data.pricing_group,
            name: data.pricing_group_name,
          }
        : null,
      logo_image:
        data.logo_image && data.logo_image_url
          ? [
              {
                id: data.logo_image,
                url: data.logo_image_url,
              },
            ]
          : [],
      select_category: {
        add_set: [],
        remove_set: [],
        allow_all: data.allow_all_pro_cat,
        disallow_all: false,
      },
      select_staff: {
        add_set: [],
        remove_set: [],
        allow_all: false,
        disallow_all: false,
      },
      select_beat: {
        add_set: [],
        remove_set: [],
        allow_all: data.allow_all_beats,
        disallow_all: false,
      },
    });

    setFormInput((prevState) => ({
      ...prevState,
      total_beat_count: data.beats.length,
      total_product_category_count: data.product_category.length,
      parents_count: data.parents_count,
      total_staff_count: data.staff_count,
      map_location_lat: data.map_location_lat,
      map_location_long: data.map_location_long,
      init_map_location: id ? !!data.map_location_lat : true,
      geo_address: data.geo_address || "",
      prev_mobile: data.mobile,
    }));
  };

  // handle customer add form
  const handleSubmit = async (formData) => {
    if (formCount < 4) {
      if (
        formCount === 2 &&
        formInput.is_geo_address_required &&
        !formInput.geo_address
      )
        return;
      setFormCount(formCount + 1);
      formData = { ...formInput, ...formData };
      setFormInput(formData);
    }
    if (formCount === 4) {
      setIsLoading(true);
      formData = {
        ...formInput,
        ...formData,
        pricing_group: formData.pricing_group?.id
          ? formData.pricing_group?.id
          : 0,
        customer_parent_name: formInput?.customer_parent?.name,
        customer_parent: formInput?.customer_parent?.id,
      };

      if (cookies.get("rupyzLocationEnable") === "true") {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted") {
            getGeoLocationAndAddress()
              .then((response) => {
                apiCallingForAddDistributor({
                  ...formData,
                  geo_location_lat: response.lat,
                  geo_location_long: response.lng,
                  activity_geo_address: response.address,
                  location_permission: true,
                });
              })
              .catch((error) => console.log(error));
            return;
          }
          openNotification({ ...formData, location_permission: false });
        });
        return;
      }
      apiCallingForAddDistributor({ ...formData, location_permission: false });
    }
  };

  const apiCallingForAddDistributor = async (values) => {
    let customerDataList = { ...values };
    const custom_form_data = await createPostFormData(
      formInput,
      getCustomerFormItems(),
      {
        pricing_group: (value) => `${value?.id || ""}`,
        customer_parent: (value) => `${value?.id || ""}`,
      }
    );
    Object.assign(customerDataList, {
      custom_form_data: convertValues(custom_form_data),
      pricing_group: formInput.pricing_group?.id,
      pricing_group_name: formInput.customer_parent?.name,
      logo_image: 0,
    });
    customerDataList = {
      ...removeEmpty(customerDataList),
      map_location_lat:
        formInput.map_location_lat > 0 ? formInput.map_location_lat : 0,
      map_location_long:
        formInput.map_location_long > 0 ? formInput.map_location_long : 0,
      geo_address: formInput?.geo_address || "",
    };

    const response = await customerAddDistributor(customerDataList, id);
    if (response && response.status === 200) {
      setIsLoading(false);
      setFormInput(initialInput);
      setFormCount(1);
      navigate(-1);
    } else setIsLoading(false);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (values) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            setIsLoading(false);
            api.destroy();
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            api.destroy(key);
            apiCallingForAddDistributor(values);
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    api.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  //  handle modal for back confirmation
  const handleModal = () => {
    if (formCount === 1)
      return setDiscardModalAction({
        open: true,
        handleAction: () => navigate(-1),
      });
    setFormCount(formCount - 1);
  };

  const FormItemMap = {
    customer_level: () => (
      <CustomerLevelFormItems {...{ form, formInput, setFormInput }} />
    ),
    select_parents: () => <></>,
    customer_type: (field_props) => <CustomerType {...{ field_props }} />,
    mobile: () => <WhatsappNumber {...{ form, formInput }} />,
    contact_person_name: () => <ContactPerson />,
    gstin: (field_props) => <GSTField {...{ field_props }} />,
    name: () => <BusinessName />,
    pincode: (field_props) => <Pincode {...{ form, field_props }} />,
    state: () => <State />,
    payment_term: (field_props) => <PaymentTerm {...{ field_props }} />,
    select_beat: (field_props) => (
      <SelectBeat {...{ formInput, setFormInput, field_props }} />
    ),
    geo_address: (field_props) => (
      <GeoAddress
        {...{ form, formInput, setFormInput, field_props }}
        type={id ? "edit" : "add"}
      />
    ),
    select_category: (field_props) => (
      <SelectProductCategory {...{ formInput, setFormInput, field_props }} />
    ),
    select_staff: (field_props) => (
      <SelectStaff {...{ formInput, setFormInput, field_props }} />
    ),
    pricing_group: (field_props) => <PricingGroup {...{ field_props }} />,
  };

  async function fetchFormConfig(form_name) {
    const { data } =
      (await customFormAction.fetch("customer", form_name)) || {};
    if (data) {
      const filteredData = {
        sections: data.sections.map((section) => ({
          ...section,
          form_items: section.form_items.filter(
            (item) => item.status !== "hidden"
          ),
        })),
      };
      setFormConfig(filteredData);
      setFormConfigLocal(form_name, filteredData);
    }
  }

  // Calling details API for edit
  useEffect(() => {
    if (id) {
      dispatch(customerDetails(id));
    }
  }, [id]);

  // calling API initially
  useEffect(() => {
    localStorage.setItem("customer_detail", JSON.stringify({}));
    dispatch(preferencesAction());
    dispatch(pricingGroupListService("", true));
    type === "lead" && dispatch(singleLeadDataAction(lead_id));
  }, []);

  // setting the incoming values from API request in initial State
  useEffect(() => {
    if (gst?.data && gst.data.data.error === false) {
      const formAddressLine1 = form.getFieldValue("address_line_1");
      const formCity = form.getFieldValue("city");
      const formState = form.getFieldValue("state");
      const formPincode = form.getFieldValue("pincode");

      form.setFieldsValue({
        name: state.gst.data.data.data.legal_name,
        ...(!formAddressLine1 &&
          !formCity &&
          !formState &&
          !formPincode && {
            address_line_1: state.gst.data.data.data.address_line_1,
            city: state.gst.data.data.data.city,
            state: state.gst.data.data.data.state,
            pincode: state.gst.data.data.data.pincode,
          }),
      });
    }
    if (
      id &&
      disributor_details.data &&
      disributor_details.data.data.error === false
    ) {
      handleCustomerDetails(disributor_details.data.data.data);
    }
    if (
      type === "lead" &&
      state.singleLeadDataAction.data &&
      !state.singleLeadDataAction.data.data.error
    ) {
      handleLeadDetails(state.singleLeadDataAction.data.data.data);
    }
  }, [
    state.gst?.data,
    id,
    state.disributor_details?.data,
    type,
    state.singleLeadDataAction?.data,
  ]);

  useEffect(() => {
    if (formCount === 4) return;
    fetchFormConfig(formCount);
  }, [formCount]);

  return (
    <>
      <Form
        key={`customer-${id}`}
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError={{
          block: "center",
          behavior: "smooth",
        }}
        initialValues={{
          customer_level: "LEVEL-3",
          payment_term: "",
          select_category: {
            add_set: [],
            remove_set: [],
            allow_all: false,
            disallow_all: false,
          },
          select_staff: {
            add_set: [],
            remove_set: [],
            allow_all: false,
            disallow_all: false,
          },
          select_beat: {
            add_set: [],
            remove_set: [],
            allow_all: false,
            disallow_all: false,
          },
          select_parents: {
            add_set: [],
            remove_set: [],
            allow_all: false,
            disallow_all: false,
          },
        }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        validateMessages={{
          required: "${label} is required.",
        }}
        onValuesChange={() => {
          setIsValueChange(true);
        }}
      >
        <div className={styles.form_top_section}>
          <div>
            <div></div>
            <div>
              <Button
                className="button_primary"
                htmlType="submit"
                loading={formCount === 4 && isLoading}
                data-testid="submit-button-id"
              >
                {formCount === 4 ? "Submit" : "Next"}
              </Button>
              <Button
                className="button_secondary"
                style={{ paddingBlock: 0 }}
                data-testid="cancel-button-id"
                onClick={() =>
                  setDiscardModalAction({
                    open: true,
                    handleAction: () => navigate(-1),
                  })
                }
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.add_edit_from}>
          <h2>
            <img
              src={ArrowLeft}
              alt="arrow"
              onClick={handleModal}
              data-testid="left-arrow-id"
            />
            &nbsp; {id ? "Update Customer" : "Add Customer"}
          </h2>
          <FormStepper totalCount={4} activeCount={formCount} />

          {formCount === 4 ? (
            <FormPreview data={formInput} />
          ) : (
            <CustomForm
              sections={formConfig["sections"] || []}
              {...{ Wrapper, FormItemMap }}
            />
          )}
          <div className={styles.form_button}>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={formCount === 4 && isLoading}
            >
              {formCount === 4 ? "Submit" : "Next"}
            </Button>

            <Button
              data-testid="back-button-id"
              className="button_secondary"
              style={{ paddingBlock: 0 }}
              onClick={handleModal}
              type="button"
            >
              Back
            </Button>
          </div>
        </div>
      </Form>
      {contextHolder}
      <BackConfirmationModal {...{ isValueChange }} />
    </>
  );
};

export default AddCustomer;

const initialInput = {
  credit_limit: 0,
  outstanding_amount: 0,
  init_map_location: true,
  map_location_lat: 0,
  map_location_long: 0,
  geo_address: "",
  is_geo_address_required: false,
  parents_count: 0,
  total_beat_count: 0,
  total_product_category_count: 0,
  total_staff_count: 0,
};

const setFormConfigLocal = (name, data) => {
  let config = JSON.parse(localStorage.getItem("customer_form_config") || "{}");
  Object.assign(config, { [`form_${name}`]: data });
  localStorage.setItem("customer_form_config", JSON.stringify(config));
};

const getCustomerFormItems = () => {
  let config = JSON.parse(localStorage.getItem("customer_form_config"));
  let itemList = [];
  for (let i = 1; i <= Object.keys(config).length; i++) {
    itemList = itemList.concat(config[`form_${i}`]["sections"]);
  }

  itemList = itemList?.map((section) => section?.form_items).flat();
  return itemList;
};

function convertValues(arr) {
  arr.map((item) => {
    switch (item.name) {
      case "outstanding_amount":
      case "credit_limit":
      case "logo_image":
        return {
          ...item,
          value: item.value ? item.value : "0",
        };
    }
    return item;
  });
  return arr;
}

function arrayToObject(arr = []) {
  return arr?.reduce((acc, item) => {
    if (item.name !== "select_beat" && item.name !== "select_staff") {
      acc[item.name] =
        item.type === "DATE_TIME_PICKER"
          ? moment(item.value).format("DD-MM-YYYY hh:mm a")
          : item.type === "RATING"
          ? Number(item.value.split("/")[0])
          : item.name === "logo_image" && item.value
          ? [{ id: Number(item.value), url: item.img_urls[0] }]
          : item.name === "logo_image" && !item.value
          ? []
          : item.value;
    }
    return acc;
  }, {});
}
