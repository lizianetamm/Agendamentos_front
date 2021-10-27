import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        eventos: [],
        usuario: [],
    },
    mutations: {
        addUsuario(state, payload) {
            state.usuario.push(payload);
        },
        addEvento(state, payload) {
            state.eventos.push(payload);
            console.log("adcionar", state.eventos)
            Vue.set(state.eventos, payload);
        },
        editarEventos(state, payload) {
            console.log("editar")
            let index = state.eventos.findIndex(evento => evento.id == payload.id);
            Vue.set(state.eventos, index, payload);

        },
        excluirEvento(state, payload) {
            console.log("remove")
            let index = state.eventos.findIndex(evento => evento.id == payload);
            state.eventos.splice(index, 1);
            Vue.set(state.eventos, index, payload);

        },

    }

})