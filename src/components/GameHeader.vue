<template>
  <el-input
    class="challenge_input"
    placeholder="Type your challenge here..."
    v-model="value"
    :readonly="!editable"
    :autofocus="editable"
  >
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
  emits: ['update:challenge'],
  computed: {
    value: {
      get(): string | undefined {
        return this.challenge;
      },
      set(value: string) {
        this.$emit('update:challenge', value);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.challenge_input {
  margin-top: 1rem;
}
</style>
