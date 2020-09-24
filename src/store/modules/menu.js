import { db, storage } from "@/firebase/init";
import Vue from "vue";

/*
 Menu schema:
menu = {
  "storeID" [item1, item2,...],
  "storeID2" ...
}
*/

export default {
  state: {
    menu: {},
  },
  getters: {
    getMenu: (state) => state.menu,
  },
  mutations: {
    replaceMenuItem(state, payload) {
      const { storeId, item } = payload;
      var currentItems = state.menu[storeId];
      var filteredItems = currentItems.filter((menuItem) => {
        return item.id != menuItem.id;
      });
      filteredItems.push(item);
      Vue.set(state.menu, storeId, filteredItems);
    },
    removeMenuItem: (state, payload) => {
      const { storeId, itemId } = payload;
      var filteredItems = state.menu[storeId].filter((menuItem) => {
        return itemId != menuItem.id;
      });
      Vue.set(state.menu, storeId, filteredItems);
    },
    setMenu(state, payload) {
      Vue.set(state.menu, payload.storeId, payload.items);
    },
    addMenuItem(state, payload) {
      if (Object.prototype.hasOwnProperty.call(state.menu, payload.storeId)) {
        var currItems = state.menu[payload.storeId];
        currItems.push(payload.item);
        Vue.set(state.menu, payload.storeId, currItems);
      }
    },
  },
  actions: {
    // cached action: receives the store object
    async fetchMenuItems({ commit }, payload) {
      const { menu, id } = payload;
      var items = await Promise.all(
        menu.map((itemId) => {
          return db
            .collection("Menu")
            .doc(itemId)
            .get()
            .then((doc) => {
              return { id: itemId, ...doc.data() };
            })
            .catch((err) => console.log(err));
        })
      );
      return commit("setMenu", { storeId: id, items });
    },
    async addMenuItem(context, payload) {
      var itemRef = await db.collection("Menu").add({
        ...payload.item,
      });
      context.commit("addMenuItem", {
        item: { id: itemRef.id, ...payload.item },
        storeId: payload.storeId,
      });
      return itemRef;
    },
    // ref is the document reference of the menu item
    uploadItemPic(context, { ref, image }) {
      var storageRef = storage.ref();
      var storePic = storageRef.child("/itemPics/" + ref.id + ".jpg");
      return storePic.put(image).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          return ref.update({
            image: downloadURL,
          });
        });
      });
    },
    async editMenuItem(context, item) {
      const { name, price, id, deliverySlots, nm, storeId } = item;
      await db
        .collection("Menu")
        .doc(id)
        .update({
          price,
          deliverySlots,
          name,
          nm,
        });
      return context.commit("replaceMenuItem", {
        item: {
          name,
          price,
          deliverySlots,
          nm,
          id,
        },
        storeId,
      });
    },
    async deleteMenuItem({ dispatch, commit }, payload) {
      await dispatch("removeMenuItemFromStore", payload);
      await db
        .collection("Menu")
        .doc(payload.itemId)
        .delete();
      return commit("removeMenuItem", payload);
    },
    addNonMarkup(context, { id, nm }) {
      return db
        .collection("Menu")
        .doc(id)
        .update({
          nm,
        });
    },
  },
};
