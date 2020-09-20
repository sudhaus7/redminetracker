<template>
<li  class="list-group-item issue" v-if="issue.visible">
  <div class="media-body">
    <span class="issueid">{{ issue.id }}</span>
    <span class="desc">
    <span class="project">({{ issue.project.name }})</span><br/>
    {{ issue.subject }}<br/>
    <span v-if="issue.due_date">Bis: {{ issue.due_date | dateParse('YYYY-MM-DD') | dateFormat('DD.MM.YYYY') }}</span>
    <span v-if="issue.estimated_hours"> | Max {{ issue.estimated_hours }}h</span>
    <span v-if="issue.time_spent"> | Ist {{ issue.time_spent }}h</span>
    <span v-if="issue.estimated_hours"> | Done {{ issue.done_ration | percentage }} </span>
    </span>
    <button class="btn btn-default" v-on:click="startTracker(issue)"><span class="icon icon-play"></span></button>

  </div>
  <!-- <pre>{{ issue | pretty }}</pre> -->
</li>
</template>

<script>

import {mapActions} from "vuex";

export default {
  name: "IssueEntry",
  props: {
    issue: Object
  },
  methods: {
    ...mapActions(["startTracker"]),
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
