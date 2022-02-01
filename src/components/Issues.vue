<template>
  <ul class="list-group">
    <li class="list-group-header">
      <input class="form-control" placeholder="Search" type="text" v-model="filter">
    </li>
    <issue-entry :issue="issue" :key="index" v-for="(issue,index) in issues"></issue-entry>
  </ul>

</template>

<script>

import IssueEntry from "@/components/IssueEntry";
import {mapActions, mapState} from "vuex";

export default {
name: "Issues",
  components: {
    IssueEntry
  },
  data() {
    return {
      filter: "",
    }
  },
  computed: {
    ...mapState(["issues","activeredmine"]),
  },
  mounted() {
    this.fetchTheIssues();
  },
  methods: {
    ...mapActions(["getMyIssues","getSpecificIssue"]),
    async fetchTheIssues() {
      await this.getMyIssues();
    },
    async fetchSpecificIssue(issueid) {
      await this.getSpecificIssue(issueid);
    }

  },
  watch: {
    activeredmine(value) {
      this.fetchTheIssues();
    },
    filter(value) {
      value = value.toLowerCase();
      if (value.length > 0) {
        //console.log(this.issues);

        let stillhasvisible = false;
        this.issues.forEach(function(e) {
          let state = false;
          if (e.description.toLowerCase().indexOf(value) > -1) {
            state = true;
            stillhasvisible = true;
          }
          if (e.subject.toLowerCase().indexOf(value) > -1) {
            state = true;
            stillhasvisible = true;
          }
          if (e.project.name.toLowerCase().indexOf(value) > -1) {
            state = true;
            stillhasvisible = true;
          }
          if (e.id.toString().indexOf(value) > -1) {
            state = true;
            stillhasvisible = true;
          }
          e.visible = state;
        });
        if (!stillhasvisible && parseInt(value) > 0) {
          // fetch that value as ticket number
          this.fetchSpecificIssue(parseInt(value));
        }
      } else {
        //console.log(this.issues);
        this.issues.forEach(function(e) {
          e.visible = true;
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
