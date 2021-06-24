<template>
  <el-container class="full-height">
    <el-header>
      <div style="margin-top: 1rem">
        <b>Loby Id: </b><span id="span_hostId" style="cursor:pointer" @click="copy">{{ hostId }}</span>

        <el-button
          type="success"
          style="float: right"
          :v-if="isHost"
          @click="start()"
        >
          Start game
        </el-button>
      </div>
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

import { SendMessageFooter } from './../components';

export default defineComponent({
  name: 'Home',
  components: {
    SendMessageFooter,
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
      this.$message({ message: 'Copied: ' + textArea.value, duration: 1000});
      textArea.remove();
    },
  },
});
</script>
