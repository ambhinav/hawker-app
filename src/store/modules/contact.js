import { db } from '@/firebase/init';
const state = {
}

const getters = {
  //  getMessage: (state) => state.message 
}

const mutations = {
    // setStatus: (state, status) => state.status = status,
    // setMessage: (state, message) => state.message = message
}

/** Add all types of statuses and messages here */
const actions = {
    createContactRequest: (context, request) => {
      return db.collection("ContactRequests")
        .add(request)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}