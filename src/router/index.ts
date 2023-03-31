import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   {
    path: "/",
    name: "Home",
    component: () => import("@/components/SearchQuery.vue")
   },
   {
    path: "/book",
    redirect: "/"
   },
   {
    path: "/book/:id",
    name: "Book",
    component: () => import("@/views/BookView.vue")
   }
  ]
})

export default router
