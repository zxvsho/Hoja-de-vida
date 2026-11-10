import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../services/api'
import { auth } from '../services/auth'
import Inicio from '../views/Inicio.vue'
import SobreMi from '../views/SobreMi.vue'
import Estudios from '../views/Estudios.vue'
import Experiencias from '../views/Experiencias.vue'
import Contacto from '../views/Contacto.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/sobre-mi', name: 'sobre-mi', component: SobreMi },
    { path: '/estudios', name: 'estudios', component: Estudios },
    { path: '/experiencias', name: 'experiencias', component: Experiencias },
    { path: '/contacto', name: 'contacto', component: Contacto },
    { path: '/login', name: 'login', component: Login },
    { path: '/admin', name: 'admin', component: Admin, meta: { requiereAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.meta.requiereAuth && !getToken()) {
    auth.logueado = false
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
