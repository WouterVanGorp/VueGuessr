<template>
  <el-input
    @keyup.enter="send()"
    placeholder="Type here your message..."
    v-model="message"
    :readonly="!editable"
    :autofocus="editable"
  >
    <template #append>
      <el-button v-show="editable" @click="send()">Send</el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SendMessageFooter',
  props: {
    editable: Boolean,
  },
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
