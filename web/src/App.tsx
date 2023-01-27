import '@/styles/global.css'
import '@/lib/dayjs'
import { Header, SummaryTable } from '@/components'
import './App.css'
import { api } from './lib/axios'

window.Notification.requestPermission((permission) => {
  if (permission == 'granted') {
   /*  new window.Notification('Habits', {
      body: 'New habit notification',
    }) */
  }
})

navigator.serviceWorker
  .register('service-worker.js')
  .then(async (serviceWorker) => {
    let subscription = await serviceWorker.pushManager.getSubscription()
    if (!subscription) {
      const publicKeyResponse = await api.get('/push/public-key')

      subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKeyResponse.data,
      })
    }

    await api.post('/push/send', { subscription })
  })

export const App = () => {
  return (
    <div className='app'>
      <div className='app__container'>
        <Header />
        <main>
          <SummaryTable />
        </main>
      </div>
    </div>
  )
}
