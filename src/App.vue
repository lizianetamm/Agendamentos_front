<template>
  <v-app>
    <navbar></navbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./components/layout/navbar.vue";
import { mapMutations } from "vuex";

export default {
  name: "App",

  components: {
    navbar,
  },
  mounted() {
    this.usuario();
  },
  methods: {
    // ...mapMutations(["addUsuario"]),
    ...mapMutations(["addEvento"]),
    usuario() {
      if (localStorage.getItem("usuarioId")) {
        this.$http
          .get(`/usuario/${localStorage.getItem("usuarioId")}`)
          .then((res) => {
            console.log(res);
            this.salvaEvento(res.data.eventos);
          });
      }
    },
    salvaEvento(data) {
      data.forEach((event) => {
        console.log(event);

        this.addEvento({
          id: event.id,
          nome: event.nome,
          descricao: event.descricao,
          dataInicio: this.$moment(event.first).format("DD/MM/YYYY"),
          dataFim: this.$moment(event.first).format("DD/MM/YYYY"),
          horaInicio: this.$moment(event.first).format("HH:mm"),
          horaTermino: this.$moment(event.second).format("HH:mm"),
          first: event.first,
          second: event.second,
        });
      });
    },
  },
};
</script>