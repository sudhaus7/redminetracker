<template>
  <div class="redmineconfig">

    <button class="btn btn-default pull-right" v-on:click="delRedmine(index)"><span class="icon icon-trash"></span></button>

    <button class="btn btn-default pull-right" v-if="!config.valid" v-on:click="testRedmine()"><span class="icon icon-air"></span></button>

    <button class="btn btn-default pull-right" v-if="config.valid" v-on:click="saveRedmine()"><span class="icon icon-floppy"></span></button>


    <div class="form-group">
      <label>Name</label>
      <input class="form-control" placeholder="Redmine 1" type="text" v-model="config.name"/>
    </div>
    <div class="form-group">
      <label>Hostname</label>
      <input class="form-control" placeholder="https://redmine.com/" type="text" v-model="config.host"/>
    </div>
    <div class="form-group">
      <label>ApiKey</label>
      <input class="form-control" placeholder="XXXXXXXXXXXX" type="text" v-model="config.apikey"/>
    </div>
    <div class="form-group" v-if="config.valid">
      <label>Default Activity</label>
      <select class="form-control" v-model="config.activity_id">
        <option :key="idx" :value="activity.id" v-for="(activity,idx) in activities">{{  activity.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>Default Tracking comment</label>
      <input v-model="config.comment" class="form-control" placeholder="tracking..." type="text"/>
    </div>
  </div>
</template>

<script>
import { plain } from "@/utils/format";

export default {
  name: "RedmineConfig",
  emits: ['delete', 'save'],
  props: {
    config: Object,
    index: Number,
  },


  data() {
    return {
      activities: [],
    }
  },

  mounted() {
    this.loadActivities();
  },

  methods: {

    loadActivities() {
      if (this.config.valid) {
        window.api.redmine.activities(plain(this.config))
          .then((data) => { this.activities = data.time_entry_activities; })
          .catch((err) => console.error(err.message));
      }
    },

    delRedmine(index) {
      this.$emit('delete', index);
    },
    saveRedmine() {
      this.$emit('save');
    },
    testRedmine() {

      window.api.redmine.activities(plain(this.config))
        .then((data) => {
          this.activities = data.time_entry_activities;
          this.config.valid = true;
        })
        .catch((err) => console.error(err.message));
    }
  }
}
</script>

<style scoped>
div {
  text-align: left;
}
.redmineconfig {
  width: calc(100% - 20px);
  border: 1px solid #333;
  border-radius: 15px;
  margin: 5px 10px;
  padding: 15px;
}
input {
  width: 100%;

}
</style>
