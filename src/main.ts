import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  MdDarkmodeOutlined,
  MdLightmodeOutlined,
} from "oh-vue-icons/icons";

import App from './App.vue'
import router from './router'

addIcons(
  MdDarkmodeOutlined,
  MdLightmodeOutlined,
);

const app = createApp(App)
app.component("VIcon", OhVueIcon);
app.use(createPinia())
app.use(router)

app.mount('#app')
