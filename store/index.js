// import { createApp } from "vue";

// import { createStore } from "vuex";

// const store = createStore({
//   state() {
//     return {
//       token: null,
//     };
//   },

//   mutations: {
//     setUserToken(state, newToken) {
//       state.token = newToken;
//     },
//   },
// });

// const app = createApp("./login");

// app.use(store);
export const state = () => ({
  token: null,
});

export const mutations = {
  setUserToken(state, newToken) {
    state.token = newToken;
  },
};
