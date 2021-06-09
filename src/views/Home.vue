<template>
  <el-container class="full-height">
    <el-header> Welcome - {{ username }} </el-header>

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
  data: () => ({}),
  computed: {
    ...mapGetters(['username', 'messages']),
  },
  methods: {
    ...mapActions(['sendMessage']),
    send(message: string): void {
      this.sendMessage(message);
    },
  },
});
</script>
