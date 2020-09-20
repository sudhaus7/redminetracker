<template>
  <div class="tab-group" v-if="activeredmine">
    <div :key="index" class="tab-item" v-bind:class="{ active: activeredmine.name===config.name }" v-for="(config,index) in configs" v-on:click="switchRedmine(config)">
      {{ config.name }}
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
name: "RedmineTabs",
  data() {
    return {
      configs: Array,
    }
  },
  computed: {
    ...mapState(["globalSettings","activeredmine"]),
  },
  mounted() {
    this.getConfigs();
    this.initRedmine();
  },
  methods: {
    ...mapActions(["switchRedmine"]),


    getConfigs() {
      this.configs = this.globalSettings.get('redmineconfigs');
    },
    initRedmine() {
      if (!this.activeredmine && this.globalSettings.get('redmineconfigs').length > 0) {
        this.switchRedmine(this.globalSettings.get('redmineconfigs')[0]);

      }
    }
  }
}
</script>

<style scoped>

</style>
