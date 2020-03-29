<template>
  <div class="chat-wrap">
    <div class="chat__chat" ref="block">
      <Message
        v-for="mess in messages"
        :key="mess.text"
        :name="mess.name"
        :text="mess.text"
        :owner="mess.id === user.id"
      />
    </div>
    <div class="chat-form">
      <ChatForm />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Message from "@/components/Message";
import ChatForm from "@/components/ChatForm";
export default {
  middleware: ["chat"],
  head() {
    return {
      title: `Комната ${this.user.room}`
    };
  },
  components: { Message, ChatForm },
  computed: mapState(["user", "messages"]),
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.chat__chat {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
.chat-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
  // background: #212121;
}
</style>