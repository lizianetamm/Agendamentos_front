import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './views/login.vue';
import cadastro from './components/pages/cadastro.vue';
import eventos from './components/pages/eventos.vue'
// import teste from './components/pages/teste.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'login',
        component: login
    },
    {
        path: '/usuario',
        name: 'usuario',
        component: cadastro
    },
    {
        path: '/eventos',
        name: 'evento',
        component: eventos
    },
    {
        path: "*",
        redirect: "/404"
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router