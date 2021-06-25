<template>
  <el-container class="full-height">
    <el-header>
      <GameHeader :editable="true" /> 
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

import { SendMessageFooter, GameHeader } from '../components';

export default defineComponent({
  name: 'Loby',
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
      messages: 'messages'

    }),
  },
  methods: {
    ...mapActions({ sendMessage: 'peer/sendMessage' }),

    send(message: string): void {
      this.sendMessage(message);
    },
  },
});
</script>
