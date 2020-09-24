import { db, storage } from '@/firebase/init';
import Vue from 'vue';

/*
 Menu schema:
menu = {
  "storeID" [item1, item2,...],
  "storeID2" ...
}
*/ 

export default {
  state: {
    menu: {}
  },
  getters: {
    getMenu: (state) => state.menu
  },
  mutations: {
    /*
    setMenu(state, payload) {
      if (!state.menu.find(menuItem => menuItem.id == payload.menuItem.id)) {
        state.menu.push(payload.menuItem);
      }
    },
    replaceMenuItem(state, payload) {
      state.menu = state.menu.filter(menuItem => {
        return menuItem.id != payload.menuItem.id;
      });
      if (!state.menu.find(menuItem => menuItem.id == payload.menuItem.id)) {
        state.menu.push(payload.menuItem);
      }
    },
    removeMenuItem: (state, payload) => {
        state.menu = state.menu.filter(menuItem => {
            return menuItem.id != payload.menuItem.id;
        });
    },
    */
    setMenu(state, payload) {
      Vue.set(state.menu, payload.storeId, payload.items)
    }
  },
  actions: {
    initMenu(context) {
      db.collection("Menu")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            var menuData = doc.data();
            menuData.id = doc.id;
            if (change.type == "added") {
              context.commit("setMenu", {
                menuItem: menuData
              });
            }
            if (change.type == "modified") {
              context.commit("replaceMenuItem", {
                menuItem: menuData
              });
            }
            if (change.type == "removed") {
              context.commit("removeMenuItem", {
                menuItem: menuData
              });
            }
          });
        });
    },
    // cached action: receives the store object
    async fetchMenuItems({ commit }, payload) {
      const { menu, id } = payload;
      var items = await Promise.all(menu.map(itemId => {
        return db.collection("Menu")
          .doc(itemId)
          .get()
          .then(doc => doc.data())
          .catch(err => console.log(err))
      }))
      return commit("setMenu", { storeId: id, items });
    },
    addMenuItem(context, item) {
      return db.collection("Menu")
        .add(item)
    },
    // ref is the document reference of the menu item
    uploadItemPic(context, { ref, image }) {
      var storageRef = storage.ref()
      var storePic = storageRef.child("/itemPics/"+ref.id+".jpg")
      return storePic
      .put(image)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
            return ref.update({
              image: downloadURL
            })
        })
      })
    },
    editMenuItem(context, item) {
      const { name, price, id, deliverySlots, nm } = item;
      return db.collection("Menu")
        .doc(id)
        .update({
          price,
          deliverySlots,
          name,
          nm
        })
    },
    async deleteMenuItem({ dispatch }, payload) {
      await dispatch("removeMenuItemFromStore", payload);
      return db.collection("Menu")
        .doc(payload.itemId)
        .delete()
    },
    addNonMarkup(context, { id, nm }) {
      return db.collection("Menu")
        .doc(id)
        .update({
          nm
        })
    }
  },
};