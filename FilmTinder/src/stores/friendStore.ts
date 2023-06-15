import { createStore } from 'vuex';

const friendStore = createStore({
    state: {
        user: null, // Initial user state
      },
      mutations: {
        setUser(state, user) {
          state.user = user;
        },
      },
      actions: {
        setUser({ commit }, user) {
          commit('setUser', user);
        },
      },
      getters: {
        getUser(state) {
          return state.user;
        },
      },
})

export default friendStore;

