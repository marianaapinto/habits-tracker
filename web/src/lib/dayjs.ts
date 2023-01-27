import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)
dayjs().localeData()
dayjs.locale('en')
