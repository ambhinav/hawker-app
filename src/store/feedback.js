const state = {
    status: '',
    message: ''
}

const getters = {
   getMessage: (state) => state.message 
}

const mutations = {
    setStatus: (state, status) => state.status = status,
    setMessage: (state, message) => state.message = message
}

/** Add all types of statuses and messages here */
const actions = {
    successToast: ({ commit, dispatch }, message) => {
        commit('setStatus', 'success'),
        commit('setMessage', message)
        setTimeout(() => dispatch('clearToast'), 5000)
    },
    errorToast: ({ commit, dispatch }, message) => {
        commit('setStatus', 'failure'),
        commit('setMessage', message)
        setTimeout(() => dispatch('clearToast'), 5000)
    },
    clearToast: ({ commit }) => {
        commit('setStatus', ''),
        commit('setMessage', '')
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}