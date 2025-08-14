import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  FaUndo,
  HiSwitchHorizontal,
  MdDarkmodeOutlined,
  MdLightmodeOutlined,
  MdMoveupRound,
  MdRotaterightRound,
  MdRotate90DegreesccwRound,
  BiEraser,
  FaBomb
} from 'oh-vue-icons/icons';

import App from './App.vue';
import router from './router';

addIcons(
  FaUndo,
  HiSwitchHorizontal,
  MdDarkmodeOutlined,
  MdLightmodeOutlined,
  MdMoveupRound,
  MdRotaterightRound,
  MdRotate90DegreesccwRound,
  BiEraser,
  FaBomb
);

const app = createApp(App);
app.component('VIcon', OhVueIcon);
app.use(createPinia());
app.use(router);

app.mount('#app');
