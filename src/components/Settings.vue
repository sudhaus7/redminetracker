<template>
<div class="settings">
  <div class="toolbar">
    <div class="toolbar-actions">
      <button class="btn btn-default" v-on:click="addRedmine()"><span class="icon icon-plus"></span></button>
    </div>
  </div>


  <div class="configs">
    <redmine-config :config="config" :key="index" v-for="(config,index) in redmines"></redmine-config>
  </div>

</div>
</template>

<script>
import RedmineConfig from "@/components/RedmineConfig";
import { mapState } from "vuex";

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
  computed: {
    ...mapState(["globalSettings"]),
  },
  methods: {
    fetchConfigs() {
      this.redmines = this.globalSettings.get('redmineconfigs');
    },
    saveConfigs() {
      this.globalSettings.set('redmineconfigs',this.redmines);
    },
    delRedmine(index) {
      this.redmines.splice(index, 1);
      this.globalSettings.set('redmineconfigs',this.redmines);
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
      this.globalSettings.set('redmineconfigs',this.redmines);
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
