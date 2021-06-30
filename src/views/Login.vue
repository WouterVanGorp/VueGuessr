<template>
  <el-row
    type="flex"
    class="row-bg full-height"
    justify="center"
    align="middle"
  >
    <el-card shadow="always">
      <div>
        <el-input
          @keyup.enter="host()"
          placeholder="Enter username"
          class="mb-s"
          v-model="username"
        />

        <el-input
          @keyup.enter="join()"
          placeholder="Enter connection id"
          class="mb-s"
          v-model="connectionId"
        />

        <el-button
          type="success"
          :disabled="!connectionId.length"
          @click="join()"
        >
          Join
        </el-button>

        <el-button type="primary" @click="host()">Host</el-button>
      </div>
    </el-card>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'Login',
  data: () => ({
    username: '',
    connectionId: '',
  }),
  methods: {
    ...mapActions(['joinGame', 'hostGame']),

    join() {
      if (!this.usernameAllowed(this.username)) return;
      this.joinGame({
        username: this.username,
        connectionId: this.connectionId,
      });
      this.$router.push({ name: 'lobby' });
    },

    host() {
      if (!this.usernameAllowed(this.username)) return;
      this.hostGame(this.username);
      this.$router.push({ name: 'lobby' });
    },

    usernameAllowed: (username: string): boolean => username.length > 3,
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
