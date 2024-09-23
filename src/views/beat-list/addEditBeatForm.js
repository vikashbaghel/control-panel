// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/180748290/Form+Specifications#Beat-Form-(Add%2FEdit)

import {
  beatAddService,
  beatDetailsService,
  beatEditService,
} from "../../redux/action/beatAction";
import { Divider, Modal, Spin } from "antd";
import Cookies from "universal-cookie";
import styles from "./beat.module.css";
import AddCustomers from "./addCustomers";
import Context from "../../context/Context";
import OnChangeWarning from "./onChangeWarning";
import { BASE_URL_V2, org_id } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import rightArrow from "../../assets/globle/arrow-left.svg";
import { ListItemDesign } from "../../components/listItemDesign";
import MultiSelectSearch from "../../components/selectSearch/multiSelectSearch";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";

export default function AddEditBeatForm() {
  const cookies = new Cookies();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(window.location.search);

  const state = useSelector((state) => state);
  const { getBeatDetails, addBeat } = state;

  const context = useContext(Context);
  const { addBeatOpen, setAddBeatOpen } = context;

  const beatId = queryParams.get("edit_id") || 0;

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");
  const initialFormValues = {
    id: 0,
    name: "",
    locality: "",
    parent_customer: "",
    parent_customer_name: null,
    customer_count: 0,
    staff_count: 0,
    isParentChange: false,
    total_selectall_count: 0,
    allow_all_initial: false,
    select_customer: {
      add_set: [],
      remove_set: [],
      allow_all: false,
      disallow_all: false,
    },
    select_staff: {
      allow_all: false,
      disallow_all: false,
      remove_set: [],
      add_set: [],
    },
  };

  const chooseCustomerParent = [
    { label: "--Select--", value: "" },
    { label: customerLevelList["LEVEL-1"], value: "LEVEL-1" },
    { label: customerLevelList["LEVEL-2"], value: "LEVEL-2" },
  ];

  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedCustomerLevel, setSelectedCustomerLevel] = useState(
    chooseCustomerParent[0]
  );
  const [addCustomersModal, setAddCustomerModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [error, setError] = useState(false);
  const [removeMappedCustomers, setRemoveMappedCustomers] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [assignStaff, setAssignStaff] = useState([]);

  const handleCustomerCount = () => {
    const num1 =
      removeMappedCustomers && formValues?.isParentChange
        ? 0
        : Number(formValues?.customer_count);
    const num2 = formValues?.select_customer?.add_set?.length;
    const num3 = formValues?.select_customer?.remove_set?.length;
    const totalCount = formValues?.total_selectall_count;
    let count = 0;

    if (formValues?.select_customer?.allow_all) {
      if (formValues?.allow_all_initial) count = num1;
      else count = totalCount - num3;
    } else if (formValues?.select_customer?.disallow_all) {
      count = num2 - num3;
    } else {
      count = num1 + (num2 - num3);
    }

    if (count > 1 && count <= 30) return count + " Customers";
    else if (count > 30) return "30+ Customers";
    else return count + " Customer";
  };

  const handleClose = () => {
    setFormValues(initialFormValues);
    setError(false);
    setSelectedCustomerLevel(chooseCustomerParent[0]);
    setRemoveMappedCustomers(false);
    setAddBeatOpen(false);
  };

  const handleCreate = () => {
    if (!formValues.name) {
      setError(true);
      return;
    }

    const data = {
      id: formValues?.id,
      name: formValues?.name,
      locality: formValues?.locality,
      select_customer: formValues?.select_customer,
      select_staff: formValues?.select_staff,
      parent_customer: formValues?.parent_customer || 0,
    };

    if (beatId) {
      dispatch(beatEditService(data));
      return;
    }
    dispatch(beatAddService(data));
  };

  useEffect(() => {
    if (beatId) {
      setIsPageLoading(true);
      dispatch(beatDetailsService(beatId));
    }
  }, [beatId]);

  useEffect(() => {
    if (
      addBeatOpen &&
      beatId &&
      getBeatDetails.data &&
      !getBeatDetails.data.data.error
    ) {
      setFormValues({
        ...formValues,
        id: getBeatDetails.data.data.data?.id,
        name: getBeatDetails.data.data.data.name,
        locality: getBeatDetails.data.data.data?.locality,
        parent_customer: getBeatDetails.data.data.data?.parent_customer,
        parent_customer_name:
          getBeatDetails.data.data.data?.parent_customer_name,
        allow_all_initial: getBeatDetails.data.data.data?.allow_all,
        customer_count: getBeatDetails.data.data.data?.customer_count,
        staff_count: getBeatDetails.data.data.data?.staff_count,
        select_customer: {
          add_set: [],
          remove_set: [],
          allow_all: getBeatDetails.data.data.data?.allow_all,
          disallow_all: false,
        },
      });

      setSelectedCustomerLevel({
        label:
          customerLevelList[
            getBeatDetails.data.data.data?.parent_customer_level
          ],
        value: getBeatDetails.data.data.data?.parent_customer_level,
      });
      setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
    }

    if (addBeat.data && !addBeat.data.data.error) {
      handleClose();
    }
  }, [state]);

  return (
    <>
      <Modal
        key={`open=${addBeatOpen}`}
        open={addBeatOpen}
        closable={false}
        title={
          <div className={styles.form_heading}>
            {beatId ? "Update Beat" : "Create New Beat"}
          </div>
        }
        footer={
          <div className={styles.form_footer}>
            <div className="button_secondary" onClick={handleClose}>
              Cancel
            </div>
            <div className="button_primary" onClick={handleCreate}>
              Save
            </div>
          </div>
        }
      >
        <Spin spinning={isPageLoading}>
          <form
            className={styles.beat_form}
            style={{ opacity: isPageLoading ? 0 : 1 }}
          >
            <label className={styles.form_label}>
              <p>
                Beat Name <span style={{ color: "red" }}>*</span>
              </p>
              <input
                type="text"
                value={formValues.name}
                style={{
                  border: error && !formValues?.name ? "2px solid red" : "",
                }}
                onChange={(e) =>
                  setFormValues({ ...formValues, name: e.target.value })
                }
              />
              {error && !formValues?.name && (
                <span className={styles.error}>Beat name is required.</span>
              )}
            </label>

            <label className={styles.form_label}>
              Town/City{" "}
              <input
                type="text"
                value={formValues.locality}
                onChange={(e) =>
                  setFormValues({ ...formValues, locality: e.target.value })
                }
              />
            </label>
            <div className={styles.form_label}>
              <p>Assign Staff</p>
              <MultiSelectSearch
                apiUrl={`${BASE_URL_V2}/organization/${org_id}/beat/${beatId}/mapping/staff/`}
                onChange={(data) => setAssignStaff(data)}
                onUpdate={({ add_set, remove_set }) => {
                  setFormValues({
                    ...formValues,
                    select_staff: {
                      ...formValues.select_staff,
                      add_set,
                      remove_set,
                    },
                  });
                }}
                value={[-1, ...assignStaff]}
                params={{
                  placeholder: "Search Staff",
                  maxTagCount: 0,
                  maxTagPlaceholder: (x) => {
                    return `${
                      formValues.staff_count +
                      formValues.select_staff.add_set.length -
                      formValues.select_staff.remove_set.length
                    } selected`;
                  },
                  onInputKeyDown: (e) => {
                    if (e.target.value === "" && e.keyCode === 8) {
                      e.stopPropagation();
                    }
                  },
                  allowClear: false,
                }}
                listItem={(ele) => <ListItemDesign list={ele} />}
                images={true}
              />
            </div>
            <div className={styles.form_label}>
              <p>
                Choose{" "}
                {customerLevelList["LEVEL-1"] +
                  " / " +
                  customerLevelList["LEVEL-2"]}
              </p>
              <select
                value={JSON.stringify(selectedCustomerLevel)}
                onClick={() => {
                  if (
                    (beatId &&
                      formValues?.parent_customer &&
                      selectedCustomerLevel.value &&
                      !removeMappedCustomers) ||
                    (beatId && !removeMappedCustomers)
                  ) {
                    setWarningModal(true);
                  }
                }}
                onChange={(ele) => {
                  setSelectedCustomerLevel(JSON.parse(ele.target.value));
                  setFormValues({
                    ...formValues,
                    parent_customer: "",
                    parent_customer_name: null,
                    isParentChange: true,
                    select_customer: {
                      disallow_all: false,
                      remove_set: [],
                      allow_all: false,
                      add_set: [],
                    },
                  });
                }}
              >
                {chooseCustomerParent.map((ele) => (
                  <option key={ele.value} value={JSON.stringify(ele)}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedCustomerLevel?.value && (
              <div className={styles.form_label}>
                <p>Select {selectedCustomerLevel?.label}</p>
                <SingleSelectSearch
                  key={`key ${selectedCustomerLevel?.value}`}
                  apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true&customer_level=${selectedCustomerLevel?.value}`}
                  value={formValues.parent_customer_name}
                  onChange={(data) => {
                    if (
                      (beatId &&
                        formValues?.parent_customer &&
                        selectedCustomerLevel.value &&
                        !removeMappedCustomers) ||
                      (beatId && !removeMappedCustomers)
                    ) {
                      setWarningModal(true);
                    } else
                      setFormValues({
                        ...formValues,
                        parent_customer: data?.id || 0,
                        parent_customer_name: data?.name || null,
                        isParentChange: true,
                        select_customer: {
                          disallow_all: false,
                          remove_set: [],
                          allow_all: false,
                          add_set: [],
                        },
                      });
                  }}
                  params={{
                    placeholder: `Search ${selectedCustomerLevel?.label}`,
                  }}
                />
              </div>
            )}
            <Divider
              style={{
                background: "#fff",
                height: 2,
                borderColor: "#fff",
                margin: 0,
              }}
            />
            <div className={styles.space_between}>
              <div>
                <p>Add Customer</p>
                <p className={styles.bold_black}>{handleCustomerCount()}</p>
              </div>
              <img
                src={rightArrow}
                alt="arrow"
                className={styles.right_arrow}
                onClick={() => setAddCustomerModal(true)}
              />
            </div>
          </form>
        </Spin>

        <OnChangeWarning
          {...{
            warningModal,
            setWarningModal,
            selectedCustomerLevel,
            setRemoveMappedCustomers,
          }}
        />
      </Modal>
      <AddCustomers
        {...{
          addCustomersModal,
          setAddCustomerModal,
          formValues,
          setFormValues,
          removeMappedCustomers,
        }}
      />
    </>
  );
}

export function setCustomersData(formValues, values, bulkSelect = false) {
  let obj = bulkSelect ? values : formValues?.select_customer;
  let { allow_all, disallow_all } = obj || {};

  const data = {
    ...formValues,
    select_customer: {
      allow_all,
      disallow_all,
      add_set: formValues.select_customer.add_set.concat(values.add_set),
      remove_set: formValues.select_customer.remove_set.concat(
        values.remove_set
      ),
    },
  };

  return data;
}
