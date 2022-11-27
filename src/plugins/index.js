/* FORM */
import { ValidationObserver } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import "@/utils/veeValidateRules";
// import FormElementWithValidation from "@/components/FormElementWithValidation";


/*V-SELECT */
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";

/* --------------------------- Finish Importing ------------------------------ */

const components = {
  ValidationObserver,
  ValidationProvider,
  vSelect
}
const Plugin = {
  install(Vue) {
    /* COMPONENTS */
    Object.keys(components).forEach((key) => {
      Vue.component(key, components[key])
    });
  }
}

export default Plugin