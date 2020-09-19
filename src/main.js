
import Vue from 'vue'
import Vuex from "vuex";
import VueRouter from "vue-router";

import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse';

const electron = window.require('electron');
const ElectronStore = window.require('electron-store');

import IssuesView from '@/components/Issues';
import SettingsView from '@/components/Settings';


import App from './App.vue'
import Redmine from 'node-redmine'

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueFilterDateFormat);
Vue.use(VueFilterDateParse);

/**
 * Vue filter to convert the given value to percent.
 * http://jsfiddle.net/bryan_k/qauf3qyh/
 *
 * @param {String} value    The value string.
 * @param {Number} decimals The number of decimal places.
 */
Vue.filter('percentage', function(value, decimals) {
  if(!value) {
    value = 0;
  }

  if(!decimals) {
    decimals = 0;
  }

  value = value * 100;
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  value = value + '%';
  return value;
});

let redmine = null;
const SettingsStore = new ElectronStore();
if (SettingsStore.get('redmine')) {
  if (SettingsStore.get('redmine.host') && SettingsStore.get('redmine.apikey')) {
    redmine = new Redmine(SettingsStore.get('redmine.host'), {apiKey: SettingsStore.get('redmine.apikey'), mode: 'no-cors'});
  }
}
SettingsStore.onDidChange('redmine', function(newValue,oldValue) {
  if (SettingsStore.get('redmine.host') && SettingsStore.get('redmine.apikey')) {
    redmine = new Redmine(SettingsStore.get('redmine.host'), {apiKey: SettingsStore.get('redmine.apikey'), mode: 'no-cors'});
  }
});

// let redmine = new Redmine('https://redmine.b-factor.de/',{apiKey:'6ffc187374b006f4ad01c2e03df0f3444b20f940', mode: 'no-cors'})

Vue.config.productionTip = false

var dump_issue = function(issue) {
  console.log('Dumping issue:');
  for (var item in issue) {
    console.log('  ' + item + ': ' + JSON.stringify(issue[item]));
  }
};


const store = new Vuex.Store({
  state: {
    issues: [],
    trackerActive: false,
    globalSettings: SettingsStore,
    tracker: {
      issue: null,
      timeElapsed: 0.0,
    }
  },
  mutations: {},
  actions: {

    startTracker(context,issue) {
      //console.log(context,issue);
      if (!context.state.trackerActive) {
        context.state.trackerActive = true;
      }
      context.state.tracker.issue = issue;
      context.state.tracker.timeElapsed = 0.0;

    },
    stopTracker(context) {
      //console.log(context,issue);
      context.state.trackerActive = false;
      context.state.tracker.issue = null;
      context.state.tracker.timeElapsed = 0.0;

    },

    async getMyIssues(context) {
     // console.log(context,redmine);
     // context.state.issues = [];
      if (redmine) {
        redmine.issues({assigned_to_id: 'me'}, function (err, data) {
          if (err) throw err;

          data.issues.map(function (issue) {
            if (context.state.issues.filter(e => e.id === issue.id).length === 0) {
              issue.time_spent = 0;
              issue.visible = true;
              context.state.issues.push(issue);

              redmine.time_entries({issue_id: issue.id, limit: 999}, function (err, data) {
                //console.log(data);
                var summ = 0;
                data.time_entries.map(function (entry) {
                  summ += entry.hours;
                });

                issue.time_spent = summ;
              });

            }
          });
          console.log('total_count: ' + data.total_count);
        });
        redmine.issues({watcher_id: 'me'}, function (err, data) {
          if (err) throw err;

          data.issues.map(function (issue) {
            if (context.state.issues.filter(e => e.id === issue.id).length === 0) {
              issue.visible = true;
              context.state.issues.push(issue);
            }
          });

          console.log('total_count: ' + data.total_count);
        });
      }
      return Promise.resolve(1);
    },
  },
});
export default store;

const routes = [
  { path: '/', component: IssuesView },
  { path: '/settings', component: SettingsView }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  render: h => h(App),
  router,
  store,

}).$mount('#app')


//export default store;
