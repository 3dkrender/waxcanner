/**
 * is someDate a today date?
 * @param {*} someDate 
 * @returns true if someDate is today
 */
const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

module.exports = isToday;