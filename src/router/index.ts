import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
   {
    path: "/",
    name: "Home",
    component: () => import("@/components/SearchQuery.vue")
   },
   {
    path: "/books",
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
