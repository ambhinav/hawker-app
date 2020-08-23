import { db } from '@/firebase/init';

export default {
  state: {
    expenses: []
  },
  getters: {
    getExpenses: (state) => state.expenses
  },
  mutations: {
    setExpenses(state, payload) {
      if (!state.expenses.find(expense => expense.id == payload.expense.id)) {
        state.expenses.push(payload.expense);
      }
    },
    // replaceExpense(state, payload) {
    //   state.expenses = state.expenses.filter(expense => {
    //     return expense.id != payload.expense.id;
    //   });
    //   if (!state.expenses.find(expense => expense.id == payload.expense.id)) {
    //     state.expenses.push(payload.expense);
    //   }
    // },
    // removeExpense: (state, payload) => {
    //     state.expenses = state.expenses.filter(expense => {
    //         return expense.id != payload.expense.id;
    //     });
    // },
  },
  actions: {
    /** Initialised when admin logs in @see Expenses.vue and when customer enters @see OrderDetails.vue */
    initExpenses(context) {
      db.collection("Expenses")
        .orderBy("created_at", 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            var expenseData = doc.data();
            expenseData.id = doc.id;
            if (change.type == "added") {
              context.commit("setExpenses", {
                expense: expenseData
              });
            }
          }
        );
      })
    },
  }
};