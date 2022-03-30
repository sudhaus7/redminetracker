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

import Redmineapi from 'node-redmine';
export default {
  name: "RedmineConfig",
  props: {
    config: Object,
    index: Number,
  },


  data() {
    return {
      activities: Array,
    }
  },

  mounted() {
    this.loadActivities();
  },

  methods: {

    loadActivities() {
      if (this.config.valid) {
        let self = this;
        let tr = new Redmineapi(this.config.host, {apiKey: this.config.apikey});
        tr.time_entry_activities(function(err,data) {
          self.activities = data.time_entry_activities;
        });
      }
    },

    delRedmine(index) {
      this.$parent.delRedmine(index);
    },
    saveRedmine() {
      this.$parent.saveConfigs();
    },
    testRedmine() {

      let self = this;
      try {
        let tr = new Redmineapi(this.config.host, {apiKey: this.config.apikey});
        tr.time_entry_activities(function(err,data) {
          //console.log(err,data,self.config);
          if (data) {
            self.activities = data.time_entry_activities;
            self.config.valid = true;
          }
        });
      } catch {
        console.log('error');
      }
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
