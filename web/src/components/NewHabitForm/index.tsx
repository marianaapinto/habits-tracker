import { Check } from 'phosphor-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { FormEvent, useState } from 'react'
import { api } from '@/lib/axios'
import './style.css'

const availableWeekDays = dayjs.weekdays()

export const NewHabitForm = () => {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  const createNewHabit = async (event: FormEvent) => {
    event.preventDefault()

    if (!title || !weekDays.length) {
      return
    }

    await api.post('habits', {
      title,
      weekDays,
    })

    setTitle('')
    setWeekDays([])

    alert('Habit successful created!')
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter((day) => day !== weekDay)
      setWeekDays(weekDaysWithRemovedOne)
      return
    }
    const weekDaysWithAddedOne = [...weekDays, weekDay]
    setWeekDays(weekDaysWithAddedOne)
  }

  return (
    <form className='new-habit-form' onSubmit={createNewHabit}>
      <label htmlFor='title' className='new-habit-form__label '>
        What is your commitment?
      </label>

      <input
        type='text'
        id='title'
        placeholder='e.g.: Exercise, sleep well, etc...'
        className='new-habit-form__input'
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor='' className='new-habit-form__label mt-4'>
        What is the frequency?
      </label>
      {availableWeekDays.map((weekDay, index) => (
        <div className='new-habit-form__checkbox-container' key={weekDay}>
          <Checkbox.Root
            className='new-habit-form__checkbox group'
            onCheckedChange={() => handleToggleWeekDay(index)}
            checked={weekDays.includes(index)}
          >
            <div className='new-habit-form__checkbox-inner group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50'>
              <Checkbox.Indicator>
                <Check size={20} className='text-white' />
              </Checkbox.Indicator>
            </div>

            <span className='new-habit-form__checkbox-label'>{weekDay}</span>
          </Checkbox.Root>
        </div>
      ))}

      <button type='submit' className='new-habit-form__button'>
        <Check size={20} weight='bold' />
        Confirm
      </button>
    </form>
  )
}
