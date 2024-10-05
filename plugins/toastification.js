import Vue from "vue";
import Toast, { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: POSITION.BOTTOM_CENTER,
  type: TYPE.ERROR,
  maxToasts: 5,
};

Vue.use(Toast, options);
