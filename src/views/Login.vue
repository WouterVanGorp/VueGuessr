<template>
  <el-row
    type="flex"
    class="row-bg full-height"
    justify="center"
    align="middle"
  >
    <el-card shadow="always">
      <div>
        <el-input placeholder="Username" class="mb-s" v-model="username" />

        <el-button type="success" @click="login()">Login</el-button>
      </div>
    </el-card>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
  name: 'Login',
  data: () => ({
    username: 'test',
  }),
  methods: {
    ...mapMutations(['setUsername']),
    login() {
      if (this.username.length < 3) return;
      this.setUsername({ username: this.username });
      this.$router.push({ name: 'home' });
    },
  },
});
</script>

<style lang="scss">
.full-height {
  height: 100%;
}

.mb-s {
  margin-bottom: 0.5rem;
}
</style>
