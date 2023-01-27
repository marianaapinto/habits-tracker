import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'
import { prisma } from './lib/prisma'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => ({
            week_day: weekDay,
          })),
        },
      },
    })
  })

  // returns habits that were completed in a certain date, if the habits were to be completed in date weekday
  app.get('/day', async (request) => {
    const getdayParams = z.object({
      // coerce converts query param in data
      date: z.coerce.date(),
    })

    const { date } = getdayParams.parse(request.query)
    const parsedDate = dayjs(date).startOf('day')
    const weekDay = dayjs(parsedDate).get('day')

    const habitsScheduledForThisDay = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date, // create_at is < or equal that date
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    })

    // habits completed in that date
    const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id)

    return { habitsScheduledForThisDay, completedHabits }
  })

  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })
    const { id } = toggleHabitParams.parse(request.params)

    // assuming we are only tracking habits on daily basis (non-retroactive complete actions)
    // we can infer the date on the server; we could also send a date parameter from client to make
    // the complete date dynamic (only verify if date is lte than today )
    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    })

    // if it is the first time an habit is being registered for this day
    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      })
      return
    }

    // registering the relation between the today's date and habit id (an habit was completed today)
    await prisma.dayHabit.create({
      data: {
        day_id: day.id,
        habit_id: id,
      }
    })

  })

  app.get('/summary', async () => {
    // return array of object corresponding to each day, habitsScheduledForThisDay and completedHabits
   
    // to handle this more complex query, to be more performant, use query raw
   const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        /* get completed habits */
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habit DH
          WHERE DH.day_id = D.id
        ) as completed,
        /* get habitsScheduledForThisWeekDay */
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as total
      FROM days D
    `

    return summary
  })
}
