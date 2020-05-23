export function handleTime(time, isWeek=true, hours=false) {
  time = new Date(time)
  let week = time.getDay()
  let mon = time.getMonth()
  let day = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()

  if (week == 0) week = "周日"
  if (week == 1) week = "周一"
  if (week == 2) week = "周二"
  if (week == 3) week = "周三"
  if (week == 4) week = "周四"
  if (week == 5) week = "周五"
  if (week == 6) week = "周六"
  if (mon < 10) mon = `0` + mon
  if (day < 10) day = `0` + day
  if (hour < 10) hour = `0` + hour
  if (minute < 10) minute = `0` + minute

  if (isWeek && !hours) {
    return `${mon}-${day} ${week}`
  } else if (isWeek && hours) {
    return `${mon}-${day} ${week} ${hour}:${minute}`
  } else if (!isWeek && hours) {
    return `${mon}-${day} ${hour}:${minute}`
  } else {
    return `${mon}-${day}`
  }

  
}