import { createApp } from 'vue'
import {
  fluentAnchor,
  fluentButton,
  fluentDivider,
  provideFluentDesignSystem,
} from '@fluentui/web-components'
import App from './App.vue'
import router from './router'

provideFluentDesignSystem().register(
  fluentAnchor(),
  fluentButton(),
  fluentDivider(),
)

const app = createApp(App)

app.use(router)

app.mount('#app')
