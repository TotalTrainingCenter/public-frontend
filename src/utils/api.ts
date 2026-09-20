import { ofetch } from 'ofetch'
import { getI18n } from '@/plugins/i18n'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  retry: 1,
  retryDelay: 500,
  retryStatusCodes: [401, 403],
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken)
      options.headers.append('Authorization', `Bearer ${accessToken}`)
  },
  async onResponseError({ response }) {
    const cookieExpired = useCookie<boolean>('expired')

    if ([401, 403].includes(response.status)) {
      cookieExpired.value = true
    }
    else {
      // eslint-disable-next-line no-alert
      alert(response._data.message || getI18n().global.t('message.requestFailed'))
    }
  },
})
