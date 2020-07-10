import { db } from '@/firebase/init';
import { getTimeStamp } from '@/utils/dateTimeUtil';
const state = {
  requests: []
}

const getters = {
   getContactRequests: (state) => state.requests 
}

const mutations = {
  setRequests(state, payload) {
    if (!state.requests.find(request => request.id == payload.request.id)) {
      state.requests.push(payload.request);
    }
  }
}

const actions = {
    /** Initialised when admin logs in @see AdminContact.vue */
    initContact(context) {
      db.collection("ContactRequests")
        .orderBy("created_at", "desc")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            var requestData = doc.data();
            requestData.id = doc.id;
            if (change.type == "added") {
              context.commit("setRequests", {
                request: requestData
              });
            }
          })
        })
    },
    createContactRequest: (context, request) => {
      return db.collection("ContactRequests")
        .add({ 
          created_at: getTimeStamp(), 
          ...request 
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}