import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'home',
      component: HomeView, 
    },
    {
      path: '/city/:cityName', 
      name: 'city-detail',
      component: HomeView, 
      meta: { abrirModalDetalle: true },
    },
    {
      path: '/comparative', 
      name: 'comparative-versus',
      component: HomeView, 
      meta: { abrirModalComparativa: true },
    },
    {
      path: '/modal',
      name: 'modal-compo',
      component: () => import('@/assets/ModalView.vue') 
    },
    {
      path: '/searchbar',
      name: 'searchbar-compo',
      component: () => import('@/assets/SearchBarView.vue') 
    },
    {
      path: '/filters',
      name: 'filters-compo',
      component: () => import('@/assets/FiltersView.vue') 
    }
  ],
})

export default router