export function GetYearTerm() {
  let date = new Date()
  let data = {
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
