<template>
  <v-container>
    <v-card elevation="4" class="mt-7 mb-5 ml-2 mr-2">
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Semana</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Mês</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
            locale="pt-br"
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn icon>
                    <v-icon
                      @click="getEvento(selectedEvent.id)"
                      >mdi-pencil</v-icon
                    >
                  </v-btn>
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <span v-html="selectedEvent.inicio"></span>
                  </v-btn>
                  <v-btn icon>
                    <span v-html="selectedEvent.fim"></span>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn icon color="secondary" @click="remove()">
                    <v-icon>mdi-delete-forever</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
      <v-dialog v-model="conflito" persistent max-width="550px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Evento conflitando na agenda!</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="text-h5">Salvar assim mesmo?</span>
              </v-col>
            </v-row>          
            <v-row class="alinhamento mt-1">
            <v-btn          
            color="black darken-1"
            text
            @click="conflito = false"
            >Não</v-btn
          >                
          <v-btn          
            color="black darken-1"
            text         
            @click="salvarBD"
            >Sim</v-btn
          >
          </v-row></v-card-text>        
        </v-card>
      </v-dialog>
      <v-dialog v-model="removeEvento" persistent max-width="550px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Certeza que deseja excluir esse evento?</span>
          </v-card-title>
          <v-card-text><v-row class="alinhamento mt-1">
            <v-btn          
            color="black darken-1"
            text
            @click="removeEvento = false"
            >Não</v-btn
          >
          <v-btn          
            color="black darken-1"
            text         
            @click="excluir(selectedEvent.id)"
            >Sim</v-btn
          >
          </v-row></v-card-text>           
        </v-card>
      </v-dialog>
      <v-dialog v-model="inserirEvento" persistent max-width="550px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Inserir Evento</span>
          </v-card-title>
          <v-card-text>
            <v-row class="mx-4 mt-0">
              <v-col>
                <v-text-field
                  v-model="dinicio"
                  :rules="rulesData"
                  label="Data inicío"
                  v-mask="['##/##/####']"
                  placeholder="DD/MM/AAAA"
                  id="dinicio"
                  type: date
                  required
                ></v-text-field>
              </v-col>
                <v-col>
                <v-text-field
                  v-model="dfim"
                  :rules="rulesData"
                  label="Data fim"
                  v-mask="['##/##/####']"
                  placeholder="DD/MM/AAAA"
                  type: date
                  id="dfim"
                  required
                ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mx-4 mt-0">
              <v-col>
                <v-text-field
                  v-model="nome"
                  label="Nome do evento"
                  id="nome"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-4 mt-0">
              <v-col>
                <v-text-field
                  v-model="horaInicio"
                  label="Hora Início"
                  v-mask="['##:##']"
                  placeholder= "HH:MM"
                  :rules="rulesHora"
                  id="inicio"
                  type="Hora"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="horaTermino"
                  :rules="rulesHora"
                  label="Hora Término"
                  v-mask="['##:##']"
                  id="termino"
                  type="Hora"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-4 mt-0">
              <v-col>
                <v-textarea
                  outlined
                  v-model="descricao"
                  label="Descrição"
                  id="descricao"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="alinhamento">
              <v-btn
                elevation="3"
                text
                color="black"
                class="btnSubmit"
                @click="inserirEvento = false"
                >Cancelar</v-btn
              >
              <v-btn
              text
                elevation="3"
                color="black"
                class="btnSubmit botao"
                @click="verificacaoSalvar()"
                >Salvar</v-btn
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="snackbarColor">
        <h4 style="font-weight: 100">{{ mensagem }}</h4>

        <template v-slot:action="{ attrs }">
          <v-btn text icon v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>
<script>
import { mapMutations } from "vuex";
import jsFunctions from "../../assets/js/jsFunctions";
export default {
  data: () => ({
    dataValida: false,
    dinicio: "",
    dfim: "",
    conflito: false,
    removeEvento: false,
    nome: "",
    descricao: "",
    horaInicio: 0,
    horaTermino: 0,
    mensagem: "",
    snackbar: false,
    snackbarColor: "",
    inserirEvento: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Mês",
      week: "Semana",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "pink",
    ],
  }),
  computed: {
    rulesHora() {
      let rules = [];
      let valor = this.horaValida();

      if (!valor) {
        rules.push("Verifique o horário");
      }

      if (this.horaInicio > this.horaTermino) {
        rules.push("Horários incompatíveis");
      }
      return rules;
    },
    rulesData() {
      let rules = [];
      let agora = this.$moment().format("DD/MM/YYYY");

      if (this.dinicio < agora) {
        rules.push("Verifique as datas");
      }
      if (this.dinicio > this.dfim) {
        rules.push("Verifique as datas");
      }
      return rules;
    },
  },

  mounted() {
    this.$refs.calendar.checkChange();
    this.updateRange();
  },
  methods: {
    ...mapMutations(["addEvento"]),
    ...mapMutations(["editarEventos"]),
    ...mapMutations(["excluirEvento"]),
    editarEvento() {
      let frm = {
        id: this.id,
        nome: this.nome,
        descricao: this.descricao,
        dataInicio: this.dinicio,
        dataFim: this.dfim,
        horaInicio: this.horaInicio,
        horaTermino: this.horaTermino,
      };
      let data = this.$moment(this.dinicio, "DD/MM/YYYY").format("YYYY-MM-DD");
      let data2 = this.$moment(this.dfim, "DD/MM/YYYY").format("YYYY-MM-DD");
      frm.first = data + "T" + this.horaInicio + ":00.000Z";
      frm.second = data2 + "T" + this.horaTermino + ":00.000Z";
      this.$http
        .put(`/evento/${this.id}`, frm)
        .then(() => {
          this.exibeSnack("#000080", "Evento editado com sucesso!");
          this.editarEventos(frm);
          this.updateRange();
          this.limparCampos();
          this.selectedEvent.name = frm.nome;
          this.selectedEvent.inicio = frm.horaInicio;
          this.selectedEvent.fim = frm.horaTermino;
          this.selectedEvent.details = frm.descricao;
        })
        .catch(() => {
          this.exibeSnack("red", "Erro ao editar, tente novamente!");
        });
    },
    remove() {
      this.removeEvento = !this.removeEvento;
    },
    excluir(id) {
      let frm = {
        id: id,
      };
      this.$http
        .delete(`/evento/${id}`)
        .then(() => {
          this.excluirEvento(frm);
          this.updateRange();
          this.removeEvento = !this.removeEvento;
          this.exibeSnack("#000080", "Evento excluido com sucesso!");
        })
        .catch(() => {
          this.exibeSnack("red", "Erro ao excluir, tente novamente!");
        });
    },

    getEvento(id) {
      this.id = id;
      this.inserirEvento = !this.inserirEvento;

      let evento = this.$store.state.eventos.filter(
        (evento) => evento.id == id
      );
      evento = evento[0];
      this.nome = evento.nome;
      this.dinicio = evento.dataInicio;
      this.dfim = evento.dataFim;
      this.horaInicio = evento.horaInicio;
      this.horaTermino = evento.horaTermino;
      this.descricao = evento.descricao;
    },
    limparCampos() {
      this.dinicio = "";
      this.dfim = "";
      this.nome = "";
      this.horaInicio = 0;
      this.horaTermino = 0;
      this.descricao = "";
      this.id = null;
      // this.updateRange();
    },
    viewDay({ date }) {
      this.focus = date;
      this.limparCampos();
      this.dinicio = this.$moment(this.focus, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      this.dfim = this.$moment(this.focus, "YYYY-MM-DD").format("DD/MM/YYYY");

      this.inserirEvento = !this.inserirEvento;
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.updateRange();
      this.$refs.calendar.prev();
    },
    next() {
      this.updateRange();
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange() {
      const events = [];

      this.$store.state.eventos.forEach((e) => {
        events.push({
          id: e.id,
          name: e.nome,
          start: new Date(e.first),
          end: new Date(e.second),
          details: e.descricao,
          inicio: e.horaInicio,
          fim: e.horaTermino,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
        });
      });
      this.events = [];
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    validacao() {
      this.validaData();
      if (
        this.nome != "" &&
        this.descricao != "" &&
        this.validarHora == true &&
        this.dataValida == true
      )
        return true;

      return false;
    },
    validaData() {
      let agora = this.$moment().format("DD/MM/YYYY");
      if (this.dinicio < agora) {
        this.dataValida = false;
      } else this.dataValida = true;
    },
    horaValida() {
      return (this.validarHora = jsFunctions.validarHora(
        this.horaInicio,
        this.horaTermino
      ));
    },
    exibeSnack(color, msg) {
      this.snackbarColor = color;
      this.mensagem = msg;
      this.snackbar = true;
    },
    verificacaoSalvar() {
      if (!this.validacao()) {
        this.exibeSnack("#000080", "Verifique os dados preenchidos!!!");
        return false;
      }
      this.salvarEvento();
    },
    salvarEvento() {
      if (this.id == null) this.salvar();
      else this.editarEvento();
      this.inserirEvento = !this.inserirEvento;
    },
    verificarAgenda(frm) {
      this.$store.state.eventos.forEach((event) => {
        if (frm.first > event.first && frm.first < event.second) {
          this.conflito = !this.conflito;
        } else if (frm.second < event.second && frm.second > event.first)
          this.conflito = !this.conflito;
        else if (frm.first < event.first && frm.second > event.second)
          this.conflito = !this.conflito;
      });
      if (!this.conflito) this.salvarBD();
    },
    salvar() {
      let frm = {
        nome: this.nome,
        descricao: this.descricao,
        horaInicio: this.horaInicio,
        horaTermino: this.horaTermino,
        dataInicio: this.dinicio,
        dataFim: this.dfim,
        first:
          this.$moment(this.dinicio, "DD/MM/YYYY").format("YYYY-MM-DD") +
          "T" +
          this.horaInicio +
          ":00.000Z",
        second:
          this.$moment(this.dfim, "DD/MM/YYYY").format("YYYY-MM-DD") +
          "T" +
          this.horaTermino +
          ":00.000Z",
      };
      this.verificarAgenda(frm);
    },
    salvarBD() {
      let frm = {
        nome: this.nome,
        descricao: this.descricao,
        horaInicio: this.horaInicio,
        horaTermino: this.horaTermino,
        dataInicio: this.dinicio,
        dataFim: this.dfim,
        first:
          this.$moment(this.dinicio, "DD/MM/YYYY").format("YYYY-MM-DD") +
          "T" +
          this.horaInicio +
          ":00.000Z",
        second:
          this.$moment(this.dfim, "DD/MM/YYYY").format("YYYY-MM-DD") +
          "T" +
          this.horaTermino +
          ":00.000Z",
      };
      if (this.conflito) {
        this.conflito = false;
      }
      this.$http
        .post(`/evento/${localStorage.getItem("usuarioId")}`, frm)
        .then((res) => {
          frm.id = res.data.dados.id;
          this.addEvento(frm);
          this.updateRange();
          this.exibeSnack("#000080", "Evento inserido com sucesso!");
        })
        .catch(() => {
          this.exibeSnack("red", "Erro ao salvar, tente novamente!");
        });
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