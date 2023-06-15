import { createStore } from 'vuex';

const store = createStore({
  state: {
    email: ''
  },
  mutations: {
    setEmail(state, email) {
      state.email = email;
    }
  },
  actions: {
    setEmail({ commit }, email) {
      commit('setEmail', email);
    }
  },
  getters: {
    password: state => state.email
  },

});

export default store;
