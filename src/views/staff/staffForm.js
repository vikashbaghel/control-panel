// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/180748290/Form+Specifications#Staff-Form-(Add%2FEdit)

import dayjs from "dayjs";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { Button, Form, Spin } from "antd";
import StepOne from "./form/stepOne";
import StepTwo from "./form/stepTwo";
import {
  staffDetailByIdService,
  updateStaff,
} from "../../redux/action/staffAction";
import styles from "./staff.module.css";
import StepThree from "./form/stepThree";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../assets/globle";
import FormStepper from "../../components/formStepper/formStepper";
import { useDispatch, useSelector } from "react-redux";
import { preferencesAction } from "../../redux/action/preferencesAction";
import BackConfirmationModal from "../../components/back-confirmation/BackConfirmationModal";
import Context from "../../context/Context";

const StaffForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);

  const { setDiscardModalAction } = context;
  const [isValueChange, setIsValueChange] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;

  const [formInput, setFormInput] = useState();
  const [formCount, setFormCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(id ? true : false); // New state for page loading

  const [form] = Form.useForm();

  const sendDataToAPI = async (formData) => {
    const response = await updateStaff({ ...formData, id });

    if (response && response.status === 200) {
      setIsLoading(false);
      setFormInput({});
      setFormCount(1);
      navigate("/web/staff");
    } else setIsLoading(false);
  };

  // setting the form Input fields is there is any id present
  const handleStaffDetails = (data) => {
    form.setFieldsValue({
      name: data.name,
      pan_id: data.pan_id,
      mobile: data.mobile,
      email: data.email,
      address_line_1: data.address_line_1,
      manager_staff_id: data.manager_name
        ? { id: data?.parent, name: data?.manager_name }
        : undefined,
      employee_id: data.employee_id,
      joining_date: data.joining_date ? dayjs(data.joining_date) : "",
      roles: [data.roles[0]],
      bank: data.bank_details.bank,
      account_number: data.bank_details.account_number,
      branch: data.bank_details.branch,
      ifsc_code: data.bank_details.ifsc_code,
      auto_assign_new_customers: data.auto_assign_new_customers,
      select_beat: {
        add_set: [],
        remove_set: [],
        allow_all: data.allow_all_beats,
        disallow_all: false,
      },
      select_customer: {
        add_set: [],
        remove_set: [],
        allow_all: data.allow_all_customer,
        disallow_all: false,
      },
    });
    setIsPageLoading(false);
  };

  const handleSubmit = (values) => {
    if (formCount < 3) {
      setFormCount(formCount + 1);
      values = { ...formInput, ...values };
      setFormInput(values);
      return;
    }
    if (formCount === 3) {
      setIsLoading(true);
      values = { ...formInput, ...values };
      values = {
        ...values,
        joining_date: values.joining_date
          ? values.joining_date.format("YYYY-MM-DD")
          : "",
        bank_details: {
          bank: values.bank,
          branch: values.branch,
          ifsc_code: values.ifsc_code,
          account_number: values.account_number,
        },
        manager_staff_id: values?.manager_staff_id?.id || 0,
      };
      delete values.assign;
      delete values.bank;
      delete values.branch;
      delete values.ifsc_code;
      delete values.account_number;
      sendDataToAPI(values);
    }
  };

  const handleModal = () => {
    if (formCount === 1)
      return setDiscardModalAction({
        open: true,
        handleAction: () => navigate(-1),
      });
    setFormCount(formCount - 1);
  };

  const formSteps = [<StepOne />, <StepTwo />, <StepThree />];

  const handleValuesChange = () => {
    setIsValueChange(true);
  };

  // Calling details API for edit
  useEffect(() => {
    if (id) {
      // setIsPageLoading(true);

      dispatch(staffDetailByIdService(id));
    }
  }, [id]);

  // calling API initially
  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  // setting the incoming values from API request in initial State
  useEffect(() => {
    if (
      id &&
      state.staff_details_by_id.data &&
      !state.staff_details_by_id.data.data.error
    ) {
      handleStaffDetails(state.staff_details_by_id.data.data.data);
    }
  }, [state]);

  return (
    <Spin spinning={isPageLoading}>
      <Form
        style={{ opacity: isPageLoading ? 0 : 1 }}
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          roles: [],
          select_beat: {
            add_set: [],
            remove_set: [],
            allow_all: false,
            disallow_all: false,
          },
          select_customer: {
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
        scrollToFirstError={true}
        onValuesChange={handleValuesChange}
      >
        <div className={styles.form_top_section}>
          <div></div>
          <div>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={formCount === 3 && isLoading}
            >
              {formCount === 3 ? "Submit" : "Next"}
            </Button>

            <Button
              className="button_secondary"
              style={{ paddingBlock: 0 }}
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
        <div className={styles.add_edit_from}>
          <h2>
            <img src={ArrowLeft} alt="arrow" onClick={handleModal} />
            &nbsp; {id ? "Update" : "Add"} Staff
          </h2>
          <FormStepper totalCount={3} activeCount={formCount} />
          {formSteps[formCount - 1]}

          <div className={styles.form_button}>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={formCount === 3 && isLoading}
            >
              {formCount === 3 ? "Submit" : "Next"}
            </Button>
            <Button
              className="button_secondary"
              style={{ paddingBlock: 5 }}
              onClick={handleModal}
              type="button"
            >
              Back
            </Button>
          </div>

          <BackConfirmationModal {...{ isValueChange }} />
        </div>
      </Form>
    </Spin>
  );
};

export default StaffForm;
