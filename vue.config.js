module.exports = {
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
        scss: {
            // prependData: `@import "@/scss/variables.scss"; @import "@/scss/_font-size-overrides.scss";`,
            prependData: `@import "@/scss/variables.scss"`,
        }
    }
  },
};
