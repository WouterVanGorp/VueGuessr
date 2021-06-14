<template>
  <el-input
    @keyup.enter="send()"
    placeholder="Type here your message..."
    v-model="message"
  >
    <template #append>
      <el-button type="success" @click="send()">Send</el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SendMessageFooter',
  data: () => ({
    message: '',
  }),
  emits: ['send'],
  methods: {
    send() {
      if (!this.message.length) return;
      this.$emit('send', this.message);
      this.message = '';
    },
  },
});
</script>
