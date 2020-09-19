<template>
<div>

  <div class="form-group">
    <label>Hostname</label>
    <input class="form-control" placeholder="https://redmine.com/" type="text" v-model="host"/>
  </div>
  <div class="form-group">
    <label>ApiKey</label>
    <input class="form-control" placeholder="XXXXXXXXXXXX" type="text" v-model="apikey"/>
  </div>
</div>
</template>

<script>

export default {
  name: "Settings",
  computed: {
      host: {
        get() {
          return this.$store.state.globalSettings.get('redmine.host');
        },
        set(value) {
          this.$store.state.globalSettings.set('redmine.host',value);
        },
      },
      apikey: {
        get() {
          return this.$store.state.globalSettings.get('redmine.apikey');
        },
        set(value) {
          this.$store.state.globalSettings.set('redmine.apikey',value);
        },
      },

      // ...
  },
}
</script>

<style scoped>
  div {
    text-align: left;
  }
  input {
    width: 100%;
  }
</style>
