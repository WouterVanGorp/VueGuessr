<template>
  <el-row
    type="flex"
    class="row-bg full-height"
    justify="center"
    align="middle"
  >
    <el-card shadow="always">
      <el-input placeholder="Username" v-model="username" />

      <el-button type="success" @click="login()">Login</el-button>
    </el-card>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
  name: 'Login',
  data: () => ({
    username: '',
  }),
  methods: {
    ...mapMutations(['setUsername']),
    login() {
      if (this.username.length < 3) return;
      this.$store.commit('setUsername', { username: this.username });
      this.$router.push({ name: 'home' });
    },
  },
});
</script>
