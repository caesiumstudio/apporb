<template>
  <div class="notif-container">
    <div class="ui header">History</div>
    <div class="ui divider"></div>
    <template v-for="entry in history" :key="entry.id">
      <div class="ui segment blue">
        <h4>{{ entry.title }}</h4>
        <div>Id: {{ entry.id }}</div>
        <div>Timestamp: {{ entry.time }}</div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    history: Array,
  },
};
</script>
<style scoped>
.notif-container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  padding: 8px 8px 128px 8px;
}
</style>