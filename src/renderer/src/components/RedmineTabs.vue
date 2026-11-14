<template>
  <div class="tab-group" v-if="activeredmine">
    <div :key="index" class="tab-item" v-bind:class="{ active: activeredmine.name===config.name }" v-for="(config,index) in configs" v-on:click="switchRedmine(config)">
      {{ config.name }}
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {useMainStore} from "@/stores/main";

export default {
name: "RedmineTabs",
  data() {
    return {
      configs: [],
    }
  },
  computed: {
    ...mapState(useMainStore, ["activeredmine"]),
  },
  mounted() {
    this.getConfigs().then(() => this.initRedmine());
  },
  methods: {
    ...mapActions(useMainStore, ["switchRedmine"]),


    async getConfigs() {
      this.configs = (await window.api.settings.get('redmineconfigs')) || [];
    },
    initRedmine() {
      if (!this.activeredmine && this.configs.length > 0) {
        this.switchRedmine(this.configs[0]);
      }
    }
  }
}
</script>

<style scoped>

</style>
