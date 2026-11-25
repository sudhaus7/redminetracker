import { defineStore } from 'pinia'
import { plain } from '@/utils/format'

const api = window.api
let timerid = null

function today() {
  const d = new Date()
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
}

export const useMainStore = defineStore('main', {
  state: () => ({
    issues: [],
    trackerActive: false,
    tracker: {
      issue: null,
      timeElapsed: 0.0,
      time_entry: null,
      time_entry_id: 0,
      comment: ''
    },
    activeredmine: null
  }),
  actions: {
    startTimer() {
      timerid = setTimeout(async () => {
        this.tracker.timeElapsed += 1.0
        if (this.tracker.timeElapsed % 15 === 0) {
          this.tracker.time_entry.hours += 0.25
          const payload = { hours: this.tracker.time_entry.hours, comments: this.tracker.comment }
          try {
            await api.redmine.updateTimeEntry(this.tracker.time_entry_id, { time_entry: payload })
          } catch (err) {
            console.error(err.message)
          }
        }
        this.startTimer()
      }, 60000)
    },
    stopTimer() {
      clearTimeout(timerid)
    },

    async startTracker(issue) {
      if (!this.trackerActive) {
        this.trackerActive = true
      }
      api.tracker.setActive(true)
      this.tracker.issue = issue
      this.tracker.timeElapsed = 0.0
      this.tracker.comment = this.activeredmine.comment
      const time_entry = {
        issue_id: issue.id,
        hours: 0.25,
        comments: this.tracker.comment,
        activity_id: this.activeredmine.activity_id,
        spent_on: today()
      }
      this.tracker.time_entry = { ...time_entry }
      try {
        const data = await api.redmine.createTimeEntry({ time_entry })
        this.tracker.time_entry_id = data.time_entry.id
      } catch (err) {
        console.error(err.message)
      }
      this.startTimer()
    },

    async stopTracker(callback) {
      if (this.trackerActive) {
        try {
          await api.redmine.updateTimeEntry(this.tracker.time_entry_id, {
            time_entry: { comments: this.tracker.comment }
          })
        } catch (err) {
          console.error(err.message)
          return
        }
        this.trackerActive = false
        api.tracker.setActive(false)
        this.tracker.issue = null
        this.tracker.timeElapsed = 0.0
        this.tracker.time_entry = null
        this.tracker.time_entry_id = 0
        this.tracker.comment = this.activeredmine.comment
        this.stopTimer()
      }
      if (callback) callback()
    },

    async switchRedmine(config) {
      await this.stopTracker(async () => {
        this.activeredmine = config
        await api.redmine.setActive(plain(config))
        this.issues = []
      })
    },

    async getSpecificIssue(issueid) {
      try {
        const data = await api.redmine.issue(issueid)
        const issue = data.issue
        issue.time_spent = 0
        issue.visible = true
        this.issues.push(issue)
      } catch (err) {
        // issue not found or no access: ignore as before
      }
    },

    async getMyIssues() {
      if (!this.activeredmine) return
      try {
        const mine = await api.redmine.issues({ assigned_to_id: 'me' })
        for (const issue of mine.issues) {
          if (this.issues.some((e) => e.id === issue.id)) continue
          issue.time_spent = 0
          issue.visible = true
          this.issues.push(issue)
          const entry = this.issues[this.issues.length - 1] // reactive proxy
          api.redmine
            .timeEntries({ issue_id: issue.id, limit: 999 })
            .then((data) => {
              entry.time_spent = data.time_entries.reduce((sum, e) => sum + e.hours, 0)
            })
            .catch((err) => console.error(err.message))
        }
      } catch (err) {
        console.error(err.message)
      }
      try {
        const watched = await api.redmine.issues({ watcher_id: 'me' })
        for (const issue of watched.issues) {
          if (this.issues.some((e) => e.id === issue.id)) continue
          issue.visible = true
          this.issues.push(issue)
        }
      } catch (err) {
        console.error(err.message)
      }
    }
  }
})
