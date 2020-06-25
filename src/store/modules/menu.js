import { db, storage } from '@/firebase/init';

export default {
  state: {
    menu: []
  },
  getters: {
    getMenu: (state) => state.menu
  },
  mutations: {
    setMenu(state, payload) {
      if (!state.menu.find(menuItem => menuItem.id == payload.menuItem.id)) {
        state.menu.push(payload.menuItem);
      }
    },
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
            // if (change.type == "modified") {
            //   context.commit("replaceItem", {
            //     menuItem: menuItemData
            //   });
            // }
            // if (change.type == "removed") {
            //   context.commit("removeItem", {
            //     menuItem: menuItemData
            //   });
            // }
          });
        });
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
  },
};