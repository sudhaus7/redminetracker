import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/** Convert a ratio (0..1) to a percent string, e.g. 0.5 -> "50%". */
export function percentage(value, decimals) {
  value = (value || 0) * 100
  decimals = decimals || 0
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor + '%'
}

/** Reformat a date string, e.g. ('2024-03-05') -> '05.03.2024'. */
export function formatDate(value, from = 'YYYY-MM-DD', to = 'DD.MM.YYYY') {
  return dayjs(value, from).format(to)
}

/** Plain deep copy so Vue proxies can cross the IPC boundary. */
export function plain(value) {
  return JSON.parse(JSON.stringify(value))
}
