import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import './styles.css'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import dayjs from 'dayjs'

interface HabitsListProps {
  date: Date
  onCompletedChange: (completed: number) => void
}

interface HabitsOfTheDay {
  completedHabits: string[]
  habitsScheduledForThisDay: {
    id: string
    title: string
    created_at: string
  }[]
}

export const HabitsList = ({ date, onCompletedChange }: HabitsListProps) => {
  const [habitsOfTheDay, setHabitsOfTheDay] = useState<HabitsOfTheDay>(
    {} as HabitsOfTheDay
  )

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  const fetchHabitsOfTheDay = async () => {
    try {
      const response = await api.get('day', {
        params: {
          date: date.toISOString(),
        },
      })
      setHabitsOfTheDay(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleHabitCompletion = async (
    habitId: string,
    isHabitCompleted: boolean
  ) => {
    try {
      await api.patch(`habits/${habitId}/toggle`)
      if (isHabitCompleted) {
        const completedHabits = habitsOfTheDay?.completedHabits.filter(
          (id) => id !== habitId
        )
        setHabitsOfTheDay((prevState) => ({ ...prevState, completedHabits }))
        onCompletedChange(completedHabits!.length)
        return
      }
      const completedHabits = [...habitsOfTheDay?.completedHabits!, habitId]
      setHabitsOfTheDay((prevState) => ({ ...prevState, completedHabits }))
      onCompletedChange(completedHabits!.length)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchHabitsOfTheDay()
  }, [])

  return (
    <div className='habits-list__checkbox-container'>
      {habitsOfTheDay?.habitsScheduledForThisDay?.map((habit) => {
        const isHabitCompleted = habitsOfTheDay.completedHabits?.includes(
          habit.id
        )
        return (
          <Checkbox.Root
            className='habits-list__checkbox group'
            key={habit.id}
            checked={isHabitCompleted}
            disabled={isDateInPast}
            onCheckedChange={() =>
              handleToggleHabitCompletion(habit.id, isHabitCompleted)
            }
          >
            <div className='habits-list__checkbox-inner group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50'>
              <Checkbox.Indicator>
                <Check size={20} className='text-white' />
              </Checkbox.Indicator>
            </div>

            <span className='habits-list__checkbox-label group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 capitalize'>
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}
