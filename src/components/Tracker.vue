<template>
<span class="tracker" v-if="trackerActive">
  <span v-if="tracker.issue">
    <button v-on:click="stopThis()"><span class="icon icon-stop"></span></button>
    <span class="issueid">{{ tracker.issue.id }} :</span>
    <span class="subject">{{ tracker.issue.subject }}</span>
    <span class="time">{{ tracker.timeElapsed }} min</span>
  </span>
</span>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "Tracker",

  computed: {
    ...mapState(["trackerActive","tracker","activeredmine"]),
  },
  methods: {
    ...mapActions(["stopTracker"]),
    async stopThis() {
      await this.stopTracker();
    },
  },
  watch: {
    activeredmine(value) {
      this.stopThis();
    }
  }
}
</script>

<style scoped>
  .tracker {
    display: inline-block;
    max-width: calc(100% - 75px);

  }
  .tracker button  {
    border-radius: 50%;
    border: 1px solid #aaa;
    width: 22px;
    height: 22px;
  }

  .tracker > span {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .tracker > span > * {
    margin-left: 5px;
  }
  .tracker > span .subject {
    overflow: hidden;
  }
</style>
