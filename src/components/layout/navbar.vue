<template>
  <div>
    <v-toolbar dark prominent class="degrade">
      <v-toolbar-title>Agenda de eventos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="sair">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
export default {
  methods: {
    sair() {
      localStorage.setItem("usuarioId", "");
      this.$store.state.eventos = [];
      this.$router.push('/');
    },
  },
};
</script>
<style>
.degrade {
  background-image: linear-gradient(to left, #48c6ef 0%, #6f86d6 100%);
}
</style>