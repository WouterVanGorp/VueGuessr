<template>
  <el-container class="full-height">
    <el-header>
      <GameHeader
        :editable="isChallenger && !challenge"
        v-model:challenge="newChallenge"
      />
    </el-header>

    <el-main>
      <ul>
        <li v-for="message in messages" :key="message.content">
          {{ message.sender + ': ' + message.content }}
        </li>
      </ul>
    </el-main>

    <el-footer>
      <el-button
        v-if="isChallenger && !challenge.length"
        type="success"
        style="width: 100%"
        :disabled="!newChallenge.length"
        @click="sendChallenge()"
      >
        Send challenge
      </el-button>
    </el-footer>
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
    newChallenge: '',
  }),
  computed: {
    ...mapGetters({
      isChallenger: 'game/isChallenger',
      challenge: 'game/challenge',
    }),
  },
  watch: {
    challenge(newVal) {
      this.newChallenge = newVal;
    },
  },
  methods: {
    ...mapActions({ setChallenge: 'game/setChallenge' }),

    sendChallenge(): void {
      this.setChallenge(this.newChallenge);
    },
  },
});
</script>
