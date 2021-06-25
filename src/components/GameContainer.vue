<template>
  <div id="app">
    <div class="cell cell-map">
      <slot name="map"></slot>
    </div>

    <div class="cell cell-players">
      <slot name="players"></slot>
    </div>

    <div class="cell cell-chat">
      <slot name="chat"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameContainer',
});
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 100vh;
  grid-gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}

.cell {
  background-color: lightgrey;
}

.cell-map {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}

.cell-players {
  grid-column: 4;
  grid-row: 1;
}

.cell-chat {
  grid-column: 4;
  grid-row: 2;
}
</style>
