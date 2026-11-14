<template>
<li  class="list-group-item issue" v-if="issue.visible">
  <div class="media-body">
    <span class="issueid">{{ issue.id }}</span>
    <span class="desc">
    <span class="project">({{ issue.project.name }})</span><br/>
    {{ issue.subject }}<br/>
    <span v-if="issue.due_date">Bis: {{ formatDate(issue.due_date) }}</span>
    <span v-if="issue.estimated_hours"> | Max {{ issue.estimated_hours }}h</span>
    <span v-if="issue.time_spent"> | Ist {{ issue.time_spent }}h</span>
    <span v-if="issue.estimated_hours"> | Done {{ percentage(issue.done_ration) }} </span>
    </span>
    <button class="btn btn-default" v-on:click="startTracker(issue)"><span class="icon icon-play"></span></button>

  </div>
</li>
</template>

<script>

import {mapActions} from "pinia";
import {useMainStore} from "@/stores/main";
import {formatDate, percentage} from "@/utils/format";

export default {
  name: "IssueEntry",
  props: {
    issue: Object
  },
  methods: {
    formatDate,
    percentage,
    ...mapActions(useMainStore, ["startTracker", "stopTracker"]),
    async trackThis(issue) {
      await this.stopTracker();
      await this.startTracker(issue);
    },
  }
}
</script>

<style scoped>

  .issue .issueid {
    min-width: 50px;
  }
  .issue .media-body {
    display: flex;
    flex-direction: row;
    flex-basis: fit-content;
  }
  .issue .media-body .desc {
    flex-grow: 1;
  }
  .issue .media-body button  {
    min-width: 35px;
    min-height: 35px;
    flex-shrink: 0;
  }
  .issue .media-body button span {
    width: 15px;
    height: 15px;
  }
</style>
