// Minimal Redmine REST client. Runs in the main process only; the API key
// is never logged and only sent to the configured host.

function buildUrl(host, path, params) {
  const base = host.endsWith('/') ? host : host + '/'
  const url = new URL(path.replace(/^\//, ''), base)
  for (const [key, value] of Object.entries(params || {})) {
    url.searchParams.set(key, value)
  }
  return url
}

async function request(config, method, path, { params, body } = {}) {
  if (!config || !config.host) {
    throw new Error('No Redmine configured')
  }
  const headers = { 'X-Redmine-API-Key': config.apikey || '' }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const response = await fetch(buildUrl(config.host, path, params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(`Redmine request failed: ${method} ${path} -> ${response.status} ${response.statusText}`)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const redmine = {
  issues: (config, params) => request(config, 'GET', 'issues.json', { params }),
  issue: (config, id) => request(config, 'GET', `issues/${encodeURIComponent(id)}.json`),
  timeEntries: (config, params) => request(config, 'GET', 'time_entries.json', { params }),
  createTimeEntry: (config, payload) => request(config, 'POST', 'time_entries.json', { body: payload }),
  updateTimeEntry: (config, id, payload) =>
    request(config, 'PUT', `time_entries/${encodeURIComponent(id)}.json`, { body: payload }),
  activities: (config) => request(config, 'GET', 'enumerations/time_entry_activities.json')
}
