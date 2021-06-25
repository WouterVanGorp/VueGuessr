<template>
  <el-container class="full-height">
    <el-header>
      <GameHeader
        :editable="isChallenger && !challenge"
        v-model:challenge="newChallenge"
      />
    </el-header>

    <el-main>
      <GameContainer>
        <template v-slot:map>
          <GameMap />
        </template>
        <template v-slot:players>
          <h1>hier kome de spelers</h1>
        </template>
        <template v-slot:chat> hier komt de chat </template>
      </GameContainer>
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

import {
  SendMessageFooter,
  GameHeader,
  GameMap,
  GameContainer,
} from '../components';

export default defineComponent({
  name: 'Game',
  components: {
    SendMessageFooter,
    GameHeader,
    GameMap,
    GameContainer,
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
