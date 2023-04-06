import '@fortawesome/fontawesome-free/css/all.css'
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { aliases, fa } from 'vuetify/iconsets/fa'

import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

import App from "./App.vue";
import router from "./router";

import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    }
  },
  components,
  directives,
})

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.component("infinite-loading", InfiniteLoading);

app.mount("#app");
