var formStates = {};

const formServiceConstants = {
  defaultFormState: {
    instance_id: "",
    modified_at: "",
    values: {},
  },
};

const _updateFormStates = (updatedFormStates = {}) => {
  let allformStates = JSON.parse(JSON.stringify(formStates));
  formStates = {
    ...allformStates,
    ...updatedFormStates,
  };
};

//returns form state if instance_id matches, otherwise returns default form state
const getFormState = (form_id, instance_id) => {
  if ((formStates[form_id] || {})["instance_id"] === instance_id) {
    return formStates[form_id];
  }
  return { ...formServiceConstants.defaultFormState, instance_id };
};

//updates form state if instance_id matches, otherwise resets form state
const setFormValues = (form_id, instance_id, updateValues = {}) => {
  let obj = getFormState(form_id, instance_id);
  obj.values = updateValues;
  obj.modified_at = new Date();
  _updateFormStates({ [form_id]: obj });
};

export default {
  getFormState,
  setFormValues,
};
