<template>
  <!-- <v-col cols="12"> -->
  <div class="in-wrap">
    <v-text-field label="Ваше сообщение" outlined v-model="text" @keydown.enter="send"></v-text-field>
    <v-btn icon @click="send">
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </div>
  <!-- </v-col> -->
</template>

<script>
export default {
  data: () => ({
    text: ""
  }),
  methods: {
    send() {
      this.$socket.emit(
        "createMessage",
        {
          text: this.text,
          id: this.$store.state.user.id
        },
        data => {
          if (typeof data === "string") {
            console.error(data);
          } else {
            this.text = "";
          }
        }
      );
      this.text = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.in-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .v-btn {
    margin-left: 10px;
    align-self: center;
  }
}
</style>