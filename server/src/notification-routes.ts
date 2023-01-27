import { FastifyInstance } from 'fastify'
import WebPush from 'web-push'
import { z } from 'zod'

// console.log(WebPush.generateVAPIDKeys())


const publicKey =
  'BJx6URKBhm57FvoTr6HZaQOUylXp37hXI51z6LQUwKnrrKGK5s8PskLHoxpfKmk_sACIgv9n7V3NrlsJPLgnWYw'

//setup dotenv to access env vars
const privateKey = process.env.PUSH_NOTIFICATIONS_PRIVATE_KEY

WebPush.setVapidDetails('http://lcoalhost:333', publicKey, privateKey!)

export const notificationRoutes = async (app: FastifyInstance) => {
  app.get('/push/public-key', async () => {
    return publicKey
  })

  app.post('/push/register', async (request, response) => {
    // connects the logged user with the authorizations he gave (could be authorized in different browsers)
    const subscription = request.body.subscription
    // we could now check if the user has already this subscription in DB, if not save subscription in the DB
    return response.status(201).send()
  })

  // exploratory API just to test notif sending by sending a request from the client
  app.post('/push/send', async (request, response) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    })

    const { subscription } = sendPushBody.parse(request.body)
    WebPush.sendNotification(subscription, 'Hello from server')

    return response.status(201).send()
  })
}
