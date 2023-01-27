import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ProgressBar } from '../ProgressBar'
import { HabitsList } from '../HabitsList'
import { useState } from 'react'
import './styles.css'

interface HabitDayProps {
  defaultCompleted?: number
  total?: number
  date?: Date
  disabled?: boolean
}

export const HabitDay = ({
  defaultCompleted = 0,
  disabled = false,
  total = 0,
  date,
}: HabitDayProps) => {
  const [completed, setCompleted] = useState(defaultCompleted)
  const completedPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0
  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = dayjs(date).format('dddd')

  const today = dayjs().startOf('day').toDate()
  const isCurrentDay = dayjs(date).isSame(today)

  const handleCompleteHabitsAmountChange = (completed:number) => {
    setCompleted(completed)
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx('habit-day', {
          'habit-day--disabled': disabled,
          'bg-zinc-900 border-zinc-800': completedPercentage === 0,
          'bg-violet-900 border-violet-500':
            completedPercentage > 0 && completedPercentage < 20,
          'bg-violet-800 border-violet-500':
            completedPercentage >= 20 && completedPercentage < 40,
          'bg-violet-700 border-violet-500':
            completedPercentage >= 40 && completedPercentage < 60,
          'bg-violet-600 border-violet-500':
            completedPercentage >= 60 && completedPercentage < 80,
          'bg-violet-500 border-violet-400': completedPercentage >= 80,
          'border-white border-4': isCurrentDay,
        })}
      />

      <Popover.Portal>
        <Popover.Content className='habit-day__popover'>
          <span className='habit-day__popover-weekday'>{dayOfWeek}</span>
          <span className='habit-day__popover-date'>{dayAndMonth}</span>

          <ProgressBar progress={completedPercentage} />

          {!!date && (
            <HabitsList
              date={date}
              onCompletedChange={handleCompleteHabitsAmountChange}
            />
          )}
          <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
