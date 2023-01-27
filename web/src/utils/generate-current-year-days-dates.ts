import dayjs from 'dayjs'

export const generateCurrentYearDaysDates = () => {
  const firstDayOfTheYear = dayjs().startOf('year')
  const today = new Date()

  const dates = []
  let currentDate = firstDayOfTheYear

  while (currentDate.isBefore(today)) {
    dates.push(currentDate.toDate())
    currentDate = currentDate.add(1, 'day')
  }

  return dates
}
