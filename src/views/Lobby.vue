<template>
  <el-container class="full-height">
    <el-header>
      <lobby-header :isHost="isHost" :hostId="hostId" @startGame="start" />
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

import { SendMessageFooter, LobbyHeader } from '../components';

export default defineComponent({
  name: 'Lobby',
  components: {
    SendMessageFooter,
    LobbyHeader,
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
    ...mapActions({ sendMessage: 'peer/sendMessage', startGame: 'startGame' }),

    send(message: string): void {
      this.sendMessage(message);
    },

    start() {
      this.startGame();
    },
  },
});
</script>
