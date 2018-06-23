import db from "./db"

export function GetYearTerm() {
  let data = db.Get("year_term") || {}
  if ('year' in data) return data
  let date = new Date()
  data = {
    year: date.getFullYear()
  }
  let m = date.getMonth() + 1
  if (m > 2 && m < 9) {
    data.term = 1
  } else {
    data.term = 0
  }
  return data
}
