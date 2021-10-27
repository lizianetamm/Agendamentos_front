<template>
  <v-container fluid>
    <h2 class="cor-letra text-center mt-5 pt-5">Login</h2>
    <v-row justify="center">
      <v-col lg="5">
        <v-text-field
          v-model="email"
          v-on:keyup.enter="entrar"
          label="Digite seu email"
          id="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="senha"
          v-on:keyup.enter="entrar"
          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show3 ? 'text' : 'password'"
          label="Digite sua senha"
          id="senha"
          @click:append="show3 = !show3"
          required
        ></v-text-field>
      </v-col>
    </v-row>    
    <v-row>
      <v-col class="text-center mb-5" lg="12" md="" sm="" col="5">
        <v-btn
          elevation="0"
          text
          class="btnSubmit"
          @click="entrar()"
          id="entrarLogin"
        >
          Entrar</v-btn
        >
      </v-col>
    </v-row>
    <v-row >     
      <v-col class="text-center mb-3" lg="12" md="" sm="" col="5">
        <v-btn
          elevation="0"
          text
          class="btnSubmit"
          style="text-transform: none"
          @click="cadastrar()"
          id="cadastre"
        >
          Não tem login? Cadastre-se</v-btn
        >
      </v-col>
       </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      <h4 style="font-weight: 100">{{ mensagem }}</h4>

      <template v-slot:action="{ attrs }">
        <v-btn text icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapMutations } from "vuex";
export default {  
  data() {
    return {
      show3: false,
      email: "",
      senha: "",
      mensagem: "",
      snackbar: false,
      snackbarColor: "",
    };
  },
  methods: {
    ...mapMutations(["addEvento"]),
    validacaoDePreenchimento() {
      if (this.email != "" && this.senha != "") {
        this.mensage = "";
        return true;
      }
      this.snackbarColor = "red";
      this.mensagem = "Campos incompletos";
      this.snackbar = true;
      return false;
    },
    entrar() {
      if (this.validacaoDePreenchimento()) {
        let frm = {
          email: this.email,
          senha: this.senha,
        };      
        this.$http
          .post(`/usuario/login`, frm)
          .then((res) => {            
            frm.id = res.data.dados[0].id;
            localStorage.setItem("usuarioId", frm.id);            
            this.$router.push(`/eventos`);            
          })
          .catch(() => {            
            this.snackbarColor = "red";
            this.mensagem = "Login ou senha não conferem";
            this.snackbar = true;
          });
      }     
    },
    cadastrar() {
      this.$router.push(`/usuario`);
    },
    exibeSnack(color, msg) {
      this.snackbarColor = color;
      this.mensagem = msg;
      this.snackbar = true;
    },
  },
};
</script>
<style>
.alinhamento {
  display: flex;
  justify-content: center;
}
</style>