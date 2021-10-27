<template>
  <v-container>
    <v-card>
      <h2 class="cor-letra text-center mt-5 pt-5">Cadastro de usuário</h2>
      <v-row class="mx-4">
        <v-col lg="6" class="p-0">
          <v-text-field
            v-model="nome"
            label="Nome completo"
            name="nomeCompleto"
            id="nome"
            required
          ></v-text-field>
        </v-col>
        <v-col lg="6" class="p-0">         
              <v-text-field
                v-model="date"
                label="Data de nascimento"
                persistent-hint
                v-mask="['##/##/####']"
                placeholder="DD/MM/AAAA"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                id="dataNasc"
              ></v-text-field>            
        </v-col>
      </v-row>
      <v-row class="mx-4">
        <v-col lg="6" class="p-0">
          <v-text-field
            v-model="cpf"
            v-mask="['###.###.###-##']"
            :rules="rulesCpf"
            label="CPF"
            id="cpf"
            required
          ></v-text-field>
        </v-col>
        <v-col lg="6" class="p-0">
          <v-radio-group v-model="sexo" row>
            <v-radio label="Masculino" id="m" value="M"></v-radio>
            <v-radio label="Feminino" id="f" value="F"></v-radio>
            <v-radio label="Outros" id="o" value="O"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="mx-4">
        <v-col lg="6">
          <v-text-field
            v-model="email"
            :rules="rulesEmail"
            label="Email"
            id="email"
            required
          ></v-text-field>
        </v-col>
        <v-col lg="6">
          <v-text-field
            v-model="telefone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            label="Telefone"
            id="telefone"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mx-4">
        <v-col lg="6">
          <v-text-field
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="senha"
            ref="corDoInput"
            :type="show3 ? 'text' : 'password'"
            @keyup="senhaForte(senha)"
            :rules="rulesSenha"
            :counter="30"
            label="Senha"
            class="input-group--focused"
            @click:append="show3 = !show3"
            id="senha"
            required
          ></v-text-field>
        </v-col>
        <v-col lg="6" class="p-0">
          <v-text-field
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="confirmacaoSenha"
            :type="show3 ? 'text' : 'password'"
            :counter="30"
            :rules="rulesConfirmacaoSenha"
            label="Confirme sua senha"
            class="input-group--focused"
            @click:append="show3 = !show3"
            id="confirmacaoSenha"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="alinhamento">
        <v-col class="alinhamento" lg="12">
          <v-btn
            elevation="3"
            color="white"
            class="btnSubmit botao"
            @click="login()"
            >Voltar</v-btn
          >

          <v-btn
            elevation="3"
            color="white"
            class="btnSubmit botao mr-3"
            @click="verificacaoSalvar()"
            >Salvar</v-btn
          ></v-col
        >
      </v-row>
      <v-row> </v-row>
    </v-card>
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
import jsFunctions from "../../assets/js/jsFunctions";
export default {
  data() {
    return {
      show3: false,
      id: null,
      nome: "",
      cpf: "",
      telefone: "",
      sexo: "",
      email: "",
      senha: "",
      confirmacaoSenha: "",
      date: "",
      forca: 0,
      tipoTelefone: "",
      mensagem: "",
      snackbar: false,
      menu: "",
      activePicker: "",
      snackbarColor: "",
    };
  },
  computed: {
    formataDataNasc() {
      return this.$moment(this.date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    rulesCpf() {
      let rules = [];
      let valor = this.cpfValido();
      if (!valor) {
        rules.push("CPF inválido");
      }
      return rules;
    },
    rulesSenha() {
      let rules = [];
      if (this.forca < 30) {
        rules.push("Senha fraca");
      } else if (this.forca >= 30 && this.forca < 50) {
        rules.push("Senha média");
      } else if (this.forca >= 50 && this.forca <= 75) {
        rules.push("Senha forte");
      } else {
        rules.push("Senha muito forte");
      }
      return rules;
    },
    rulesConfirmacaoSenha() {
      let rules = [];
      if (this.senha != this.confirmacaoSenha) {
        rules.push("As senhas não conferem!");
      }
      return rules;
    },
    rulesEmail() {
      let rules = [];
      let valor = this.emailValido(this.email);
      if (!valor) {
        rules.push("Email inválido");
      }
      return rules;
    },
    maxAniversario() {
      return this.$moment().subtract("years", 18).format("YYYY-MM-DD");
    },
  },
  methods: {
    login() {
      this.$router.push(`/`);
    },
    verificacaoSalvar() {
      if (!this.validacao()) {
        this.exibeSnack("#000080", "Todos os dados deverão ser preenchidos");
        return false;
      }
      this.salvar();
    },
    salvar() {
     
      let frm = {
        nome: this.nome,
        cpf: this.cpf,
        telefone: this.telefone,
        sexo: this.sexo,
        email: this.email,
        senha: this.senha,
        data_nasc: this.date,
      };

      this.$http
        .post(`/usuario/`, frm)
        .then((res) => {
          
          frm.id = res.data.dados.id;
          localStorage.setItem("usuarioId", frm.id);
          this.$router.push(`/eventos`);
        })
        .catch(() => {
          this.exibeSnack("red", "Usuario já existente!");
        });
    },

    emailValido(value) {
      return jsFunctions.validacaoEmail(value);
    },
    senhaForte(value) {
      return (this.forca = jsFunctions.validacaoSenha(value, 0));
    },
    validacao() {
      if (
        this.nome != "" &&
        this.cpf != "" &&
        this.telefone != "" &&
        this.sexo != "" &&
        this.email != "" &&
        this.senha != "" &&
        this.forca > 75 &&
        this.confirmacaoSenha != "" &&
        this.confirmacaoSenha == this.senha &&
        this.verificacaoCpf == true
      )
        return true;

      return false;
    },
    exibeSnack(color, msg) {
      this.snackbarColor = color;
      this.mensagem = msg;
      this.snackbar = true;
    },
    cpfValido() {
      return (this.verificacaoCpf = jsFunctions.validacaoCpf(this.cpf));
    },
  },
};
</script>
          
<style>
.alinhamento {
  display: flex;
  justify-content: end;
}
.botao {
  margin-left: 5px;
}
</style>
    