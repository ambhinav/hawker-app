import { db, storage } from '@/firebase/init';

export default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
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