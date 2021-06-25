<template>
  <div style="margin-top: 1rem">
    <b>Lobby Id: </b>
    <span id="span_hostId" style="cursor: pointer" @click="copy">
      {{ hostId }}
    </span>

    <el-button
      type="success"
      style="float: right"
      v-if="isHost"
      @click.stop="start()"
    >
      Start game
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LobbyHeader',
  props: {
    isHost: Boolean,
    hostId: String,
  },
  emits: ['startGame'],
  methods: {
    copy() {
      var copyText = document.getElementById('span_hostId');
      var textArea = document.createElement('textarea');
      textArea.value = copyText?.textContent ?? '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('Copy');
      this.$message({ message: 'Copied: ' + textArea.value, duration: 1000 });
      textArea.remove();
    },

    start() {
      this.$emit('startGame');
    },
  },
});
</script>
