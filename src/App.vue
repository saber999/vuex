<template>
  <div id="app">
    <div id="nav">
      {{ $store.state.age }}<br />
      我的年龄嗯testtest{{ $store.getters.getAge }}
      <button @click="add">add</button>
      <button @click="min">min</button>
      {{ $store.state.a.x }}<br />
      {{ $store.state.b.y }}
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  methods: {
    add() {
      this.$store.commit("syncAdd", 90);
    },
    min() {
      this.$store.dispatch("asyncMin", 50);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
