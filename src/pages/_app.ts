import type { App } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const queryClient = new QueryClient()

export default function createVueApp() {
  return {
    enhance: (app: App) => {
      app.use(VueQueryPlugin, { queryClient })
    }
  }
}
