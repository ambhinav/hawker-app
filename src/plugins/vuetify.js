import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from 'vuetify/lib/util/colors';
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // primary: colors.orange.lighten1,
        primary: `#f15a24`,
        secondary: colors.green,
        accent: colors.shades.black,
        error: colors.red.accent3
      }
    }
  }
});
