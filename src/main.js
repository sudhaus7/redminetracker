
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

if (!SettingsStore.get('redmineconfigs')) {
  SettingsStore.set('redmineconfigs',[]);
}

if (SettingsStore.get('redmineconfigs').length > 0) {
  redmine = connectRedmine(SettingsStore.get('redmineconfigs')[0]);
}




SettingsStore.onDidChange('redmineconfigs', function(newValue,oldValue) {
  redmine = connectRedmine(SettingsStore.get('redmineconfigs')[0]);
});


function connectRedmine(config) {
  //console.log(config);
  return new Redmine(config.host, {apiKey: config.apikey, mode: 'no-cors'});
}
// let redmine = new Redmine('https://redmine.b-factor.de/',{apiKey:'6ffc187374b006f4ad01c2e03df0f3444b20f940', mode: 'no-cors'})

Vue.config.productionTip = false

var dump_issue = function(issue) {
  console.log('Dumping issue:');
  for (var item in issue) {
    console.log('  ' + item + ': ' + JSON.stringify(issue[item]));
  }
};
function startTimer(context) {
  context.state.timerid = setTimeout(() => {
    context.state.tracker.timeElapsed += 1.0;
    if (context.state.tracker.timeElapsed % 15 === 0) {
      context.state.tracker.time_entry.hours += 0.25;
      let payload = {
        hours: context.state.tracker.time_entry.hours,
        comments: context.state.tracker.comment
      };
      redmine.update_time_entry(context.state.tracker.time_entry_id, {time_entry: payload}, function (err, data) {
        if (err) throw err;
        console.log('tick', data,payload);
      });
    }
    console.log('tock');
    startTimer(context);
  }, 60000);
}
function stopTimer(context) {
  clearTimeout(context.state.timerid);
}

function stopTracker(context,fnc) {
  //console.log(context,issue);
  fnc = fnc || function(){};
  if (context.state.trackerActive) {
    let payload = {
      comments: context.state.tracker.comment
    };
    redmine.update_time_entry(context.state.tracker.time_entry_id, {time_entry: payload}, function (err, data) {
      if (err) throw err;
      console.log('tick', data,payload);
      context.state.trackerActive = false;
      context.state.tracker.issue = null;
      context.state.tracker.timeElapsed = 0.0;
      context.state.tracker.time_entry = null;
      context.state.tracker.time_entry_id = 0;
      context.state.tracker.comment = context.state.activeredmine.comment;

      stopTimer(context);
      fnc(context);
    });

  } else {
    fnc(context);
  }
}

const store = new Vuex.Store({
  state: {
    issues: [],
    trackerActive: false,
    globalSettings: SettingsStore,
    tracker: {
      issue: null,
      timeElapsed: 0.0,
      time_entry: null,
      time_entry_id: 0,
      comment: '',
    },
    timerid: null,
    activeredmine: null,
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
      context.state.tracker.comment = context.state.activeredmine.comment;
      let mydate = new Date();
      let time_entry = {
        issue_id: issue.id,
        hours: 0.25,
        comments: context.state.tracker.comment,
        activity_id: context.state.activeredmine.activity_id,
        spent_on: mydate.getFullYear()+'-'+ ('0' + (mydate.getMonth()+1)).slice(-2) + '-' +('0' + mydate.getDate()).slice(-2)
      };
      console.log(time_entry);


      redmine.create_time_entry( {'time_entry':time_entry}, function(err,data) {
        console.log(err,data);
        context.state.tracker.time_entry_id = data.time_entry.id;
      });
      context.state.tracker.time_entry = JSON.parse(JSON.stringify(time_entry));
      startTimer(context);
      /*
var time_entry = {
  time_entry: {
    project_id: 7,
    hours: '3'
  }
};
redmine.create_time_entry(time_entry, function(err, data) {
  if (err) throw err;
  console.log(data);
});
*/


    },
    stopTracker(context) {
      stopTracker(context);
    },

    switchRedmine(context,config) {
      stopTracker(context,function() {
        context.state.activeredmine = config;
        redmine = connectRedmine(config);
        context.state.issues = [];
      });
    },

    async getSpecificIssue(context,issueid) {
      if (redmine) {
        redmine.get_issue_by_id(issueid,{},function(err,data) {
          if (!err) {
            let issue = data.issue;
            issue.time_spent = 0;
            issue.visible = true;
            context.state.issues.push(issue);
          }
        });
      }
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
