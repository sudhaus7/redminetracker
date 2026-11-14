<template>
<div class="settings">
  <div class="toolbar">
    <div class="toolbar-actions">
      <button class="btn btn-default" v-on:click="addRedmine()"><span class="icon icon-plus"></span></button>
    </div>
  </div>


  <div class="configs">
    <redmine-config :config="config" :index="index" :key="index" v-for="(config,index) in redmines" @delete="delRedmine" @save="persist"></redmine-config>
  </div>

</div>
</template>

<script>
import RedmineConfig from "@/components/RedmineConfig.vue";
import { plain } from "@/utils/format";

export default {
  name: "Settings",
  components: {
    RedmineConfig
  },
  data() {
    return {
      redmines: [],
    }
  },
  mounted() {
    this.fetchConfigs();
  },
  methods: {
    async fetchConfigs() {
      this.redmines = (await window.api.settings.get('redmineconfigs')) || [];
    },
    persist() {
      return window.api.settings.set('redmineconfigs', plain(this.redmines));
    },
    delRedmine(index) {
      this.redmines.splice(index, 1);
      this.persist();
    },
    addRedmine() {
      this.redmines.push({
        name:'',
        host:'',
        apikey:'',
        comment:'tracking',
        activity_id: 0,
        valid: false,
      });
      this.persist();
    }
  }
}
</script>

<style scoped>
  div {
    text-align: left;
  }
  input {
    width: 100%;
  }
  .settings {
    width: 100%;
  }
</style>
