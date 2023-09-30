<template>
  <router-view />
</template>
<script>
export default {
};
</script>
<style lang="less">
html,
body {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

::-webkit-scrollbar {
  background: transparent;
  width: 4px !important;
}

.light-mode {
  background-color: #fafafa !important;
}

.dark-mode {
  background-color: #2b2b2b !important;
  color: white !important;
  border: 0 !important;
}
</style>