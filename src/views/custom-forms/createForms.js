import ActivityForm from "./ActivityForm";
import CustomerForm from "./CustomerForm";

export default {
  activity: {
    title: "Activity Form",
    component: ActivityForm,
    fetchDefaultConfig: (form_name)=>{
      return require("./ActivityForm/activityForm.json")
    },
  },
  customer: {
    title: "Customer",
    component: CustomerForm,
    fetchDefaultConfig: (form_name)=>{
      return {
        '1': require("./CustomerForm/customerForm1.json"),
        '2': require("./CustomerForm/customerForm2.json"),
        '3': require("./CustomerForm/customerForm3.json"),
      }[form_name];
    },
  },
};
