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
          <GameMap :pickCoordinate="mustPickCoordinate" />
        </template>
        <template v-slot:players>
          <h3>Players</h3>
          <ul>
            <li v-for="player in [username, ...players]" :key="player">
              {{ player }}
            </li>
          </ul>
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
    coordinates: [],
  }),
  computed: {
    ...mapGetters({
      isChallenger: 'game/isChallenger',
      challenge: 'game/challenge',
      players: 'peer/getUsernames',
      username: 'username',
    }),
    
    mustPickCoordinate(): boolean {
      return (
        (this.isChallenger && !this.challenge.length) ||
        (!this.isChallenger && this.challenge.length)
      );
    },
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
