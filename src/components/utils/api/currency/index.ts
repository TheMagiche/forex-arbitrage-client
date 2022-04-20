import {AXIOS} from '../baseAxios'
export default class CurrencyApi {
  getCurrencies() {
    return AXIOS.get('api/currencies')
      .then(response => ({
        data: response.data
      }))
      .catch(e => ({errors: e.response.data}))
  }
}
