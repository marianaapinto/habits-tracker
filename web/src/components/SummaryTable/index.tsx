import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { generateCurrentYearDaysDates } from '@/utils/generate-current-year-days-dates'
import { HabitDay } from '../HabitDay'
import './styles.css'

type Summary = {
  id: string
  date: string
  total: number
  completed: number
}[]

const weekDays = dayjs.weekdays().map((weekday) => weekday[0])
const currentYearDates = generateCurrentYearDaysDates()
const minimumCurrentYearDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimumCurrentYearDatesSize - currentYearDates.length

export const SummaryTable = () => {
  const [summary, setSummary] = useState<Summary>([])
  const habitsData = useMemo(
    () =>
      currentYearDates.map((date) => {
        const dayInSummary = summary?.find((day) =>
          dayjs(date).isSame(day.date, 'day')
        )

        return {
          date,
          dayInSummary,
        }
      }),
    [summary]
  )

  useEffect(() => {
    api.get('summary').then((response) => {
      setSummary(response.data)
    })
  }, [])

  return (
    <div className='summary-table'>
      <div className='summary-table__week-days'>
        {weekDays.map((weekDay, i) => {
          return (
            <p key={`${weekDay}-${i}`} className='summary-table__day-title'>
              {weekDay}
            </p>
          )
        })}
      </div>
      <div className='summary-table__habit-days'>
        {!!summary.length &&
          habitsData.map(({ date, dayInSummary }) => (
            <HabitDay
              key={`day-${date.toString()}`}
              date={date}
              total={dayInSummary?.total}
              defaultCompleted={dayInSummary?.completed}
            />
          ))}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return <HabitDay key={i} disabled />
          })}
      </div>
    </div>
  )
}
