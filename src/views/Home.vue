<template>
  <el-container class="full-height">
    <el-header>
      <game-header :isHost="isHost" :hostId="hostId" />
    </el-header>

    <el-main>
      <ul>
        <li v-for="message in messages" :key="message.content">
          {{ message.sender + ': ' + message.content }}
        </li>
      </ul>
    </el-main>

    <el-footer>
      <send-message-footer @send="send" />
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { SendMessageFooter, GameHeader } from './../components';

export default defineComponent({
  name: 'Home',
  components: {
    SendMessageFooter,
    GameHeader,
  },
  data: () => ({
    connectionId: '',
    connection: '',
  }),
  computed: {
    ...mapGetters({
      username: 'username',
      messages: 'messages',
      isHost: 'peer/isHost',
      hostId: 'peer/hostId',
    }),
  },
  methods: {
    ...mapActions({ sendMessage: 'peer/sendMessage' }),

    send(message: string): void {
      this.sendMessage(message);
    },

    copy() {
      var copyText = document.getElementById('span_hostId');
      var textArea = document.createElement('textarea');
      textArea.value = copyText?.textContent ?? '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('Copy');
      this.$message({ message: 'Copied: ' + textArea.value, duration: 1000 });
      textArea.remove();
    },
  },
});
</script>
