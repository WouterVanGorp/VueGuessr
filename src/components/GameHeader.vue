<template>
 <el-input
    @keyup.enter="send()"
    placeholder="Type your challenge here..."
    v-model="challenge"
  >
    <template #append>
      <el-button @click="send()">Send</el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameHeader',
  computed: {},
  data: () => ({
    challenge: '',
  }),
  emits: ['challenge'],
  methods: {
    send(): void {
      if (this.challenge.length <= 5) return;
      this.$emit('challenge', this.challenge);
    },
  },
});
</script>
