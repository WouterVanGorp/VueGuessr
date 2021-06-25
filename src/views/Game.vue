<template>
  <el-container class="full-height">
    <el-header>
      <GameHeader
        :editable="isChallenger && !challenge"
        :challenge="challenge"
        @sendChallenge="sendChallenge($event)"
      />
    </el-header>

    <el-main>
      <ul>
        <li v-for="message in messages" :key="message.content">
          {{ message.sender + ': ' + message.content }}
        </li>
      </ul>
    </el-main>

    <el-footer> </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { SendMessageFooter, GameHeader } from '../components';

export default defineComponent({
  name: 'Game',
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
      isChallenger: 'game/isChallenger',
      challenge: 'game/challenge',
    }),
  },
  methods: {
    ...mapActions({ setChallenge: 'game/setChallenge' }),

    sendChallenge(newChallenge: string): void {
      this.setChallenge(newChallenge);
    },
  },
});
</script>
