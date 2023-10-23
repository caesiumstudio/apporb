<template>
  <router-view />
</template>
<script>
export default {};
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

.pt-1 {
  padding-top: 4px;
}
.pt-2 {
  padding-top: 8px;
}
.pt-3 {
  padding-top: 12px;
}
.pt-4 {
  padding-top: 16px;
}
.pt-5 {
  padding-top: 20px;
}

.pb-1 {
  padding-bottom: 4px;
}
.pb-2 {
  padding-bottom: 8px;
}
.pb-3 {
  padding-bottom: 12px;
}
.pb-4 {
  padding-bottom: 16px;
}
.pb-5 {
  padding-bottom: 20px;
}

.mt-1 {
  margin-top: 4px !important;
}
.mt-2 {
  margin-top: 8px !important;
}
.mt-3 {
  margin-top: 12px !important;
}
.mt-4 {
  margin-top: 16px !important;
}
.mt-5 {
  margin-top: 20px !important;
}

.mb-1 {
  margin-bottom: 4px !important;
}
.mb-2 {
  margin-bottom: 8px !important;
}
.mb-3 {
  margin-bottom: 12px !important;
}
.mb-4 {
  margin-bottom: 16px !important;
}
.mb-5 {
  margin-bottom: 20px !important;
}
</style>