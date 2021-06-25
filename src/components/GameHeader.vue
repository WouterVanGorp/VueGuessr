<template>
  <el-input
    class="challenge_input"
    @keyup.enter="send()"
    placeholder="Type your challenge here..."
    v-model="placeholder"
    :readonly="!editable"
    :autofocus="editable"
  >
    <template v-if="editable" #append>
      <el-button @click="send()">Send</el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameHeader',
  props: {
    editable: Boolean,
    challenge: String,
  },
  emits: ['sendChallenge'],
  data: () => ({
    placeholder: '',
  }),
  methods: {
    send(): void {
      if (!this.editable) return;
      if (!this.placeholder || this.placeholder.length <= 5) return;
      this.$emit('sendChallenge', this.placeholder);
    },
  },
  watch: {
    challenge(newVal: string) {
      this.placeholder = newVal;
    },
  },
});
</script>

<style lang="scss" scoped>
.challenge_input {
  margin-top: 1rem;
}
</style>
